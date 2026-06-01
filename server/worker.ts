import cron from "node-cron";
import { EntryStatus, NotifType, ReportType, Role, TaskStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import {
  buildKpiRecord,
  calculateAvgEntryTime,
  calculateInventoryAccuracy,
  calculateOrderFulfillmentRate,
  scoreKpiRecord,
} from "@/lib/utils/kpi-calculator";
import { sendKpiAlertEmail, sendLowStockAlert, sendTaskDueReminder } from "@/lib/email";
import { notifyUser, notifyWarehouse } from "@/server/lib/notification-publisher";
import { SOCKET_EVENTS } from "@/server/lib/events";
import { disconnectRedisClients } from "@/server/lib/redis-clients";

const WORKER_ENABLED = process.env.WORKER_ENABLED !== "false";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

async function getWarehouseManagers(warehouseId: string) {
  return prisma.user.findMany({
    where: {
      warehouseId,
      isActive: true,
      deletedAt: null,
      role: { in: [Role.MANAGER, Role.ADMIN, Role.SUPER_ADMIN, Role.SUPERVISOR] },
    },
    select: { id: true, email: true, fullNameEn: true },
  });
}

async function createNotification(input: {
  userId: string;
  titleEn: string;
  titleSi: string;
  message: string;
  type: NotifType;
  link?: string;
}) {
  const notification = await prisma.notification.create({ data: input });

  await notifyUser(input.userId, {
    id: notification.id,
    titleEn: notification.titleEn,
    titleSi: notification.titleSi,
    message: notification.message,
    type: notification.type,
    link: notification.link,
    createdAt: notification.createdAt.toISOString(),
  });

  return notification;
}

/** Daily KPI snapshot — runs at 00:05 Asia/Colombo. */
async function runKpiSnapshot(): Promise<void> {
  logger.info("Running KPI snapshot job");

  const warehouses = await prisma.warehouse.findMany({
    where: { isActive: true },
    select: { id: true, nameEn: true },
  });

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const dayStart = new Date(now);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(now);
  dayEnd.setHours(23, 59, 59, 999);

  for (const warehouse of warehouses) {
    const entries = await prisma.stockEntry.findMany({
      where: {
        warehouseId: warehouse.id,
        createdAt: { gte: dayStart, lte: dayEnd },
        status: EntryStatus.APPROVED,
      },
      select: {
        entryDuration: true,
        status: true,
        type: true,
      },
    });

    const pendingEntries = await prisma.stockEntry.count({
      where: { warehouseId: warehouse.id, status: EntryStatus.PENDING },
    });

    const approvedEntries = entries.length;
    const totalTransactions = approvedEntries + pendingEntries;

    const countLines = await prisma.physicalCountLine.findMany({
      where: {
        cycle: { warehouseId: warehouse.id, status: "COMPLETED" },
        countedQty: { not: null },
      },
      select: { expectedQty: true, countedQty: true },
      take: 100,
    });

    const accuracySamples = countLines
      .filter(
        (line): line is { expectedQty: number; countedQty: number } => line.countedQty != null,
      )
      .map((line) => calculateInventoryAccuracy(line.expectedQty, line.countedQty));
    const inventoryAccuracy =
      accuracySamples.length > 0
        ? accuracySamples.reduce((a, b) => a + b, 0) / accuracySamples.length
        : 100;

    const kpiInput = buildKpiRecord({
      inventoryAccuracy,
      avgEntryTime: calculateAvgEntryTime(entries),
      orderFulfillmentRate: calculateOrderFulfillmentRate(
        approvedEntries,
        Math.max(totalTransactions, 1),
      ),
      stockTurnoverRate: 0,
      staffProductivity: 0,
      shrinkageRate: 0,
      pickingEfficiency: 0,
      totalTransactions,
      totalErrors: pendingEntries,
    });

    const record = await prisma.kPIRecord.upsert({
      where: {
        warehouseId_month_year: {
          warehouseId: warehouse.id,
          month,
          year,
        },
      },
      create: {
        warehouseId: warehouse.id,
        recordDate: now,
        month,
        year,
        ...kpiInput,
      },
      update: {
        recordDate: now,
        ...kpiInput,
      },
    });

    const alerts = scoreKpiRecord(record).filter((m) => m.status !== "good");
    if (alerts.length === 0) continue;

    const managers = await getWarehouseManagers(warehouse.id);
    const metrics = alerts.map((a) => ({
      label: a.label,
      value: a.value,
      target: a.target,
      unit: a.unit,
    }));

    if (managers.length > 0) {
      await sendKpiAlertEmail(
        managers.map((m) => m.email),
        warehouse.nameEn,
        metrics,
      );

      for (const manager of managers) {
        await createNotification({
          userId: manager.id,
          titleEn: "KPI Alert",
          titleSi: "KPI අනතුරු අඟවීම",
          message: `${alerts.length} KPI metric(s) below target for ${warehouse.nameEn}.`,
          type: NotifType.KPI_ALERT,
          link: `${APP_URL}/kpi`,
        });
      }
    }

    await notifyWarehouse(warehouse.id, {
      warehouseId: warehouse.id,
      metrics,
      event: SOCKET_EVENTS.KPI_ALERT,
    });
  }

  logger.info("KPI snapshot job completed");
}

/** Low stock check — runs every 6 hours. */
async function runLowStockCheck(): Promise<void> {
  logger.info("Running low stock check");

  const inventoryRows = await prisma.inventory.findMany({
    where: {
      item: { isActive: true, deletedAt: null, reorderLevel: { gt: 0 } },
    },
    include: {
      item: {
        select: {
          id: true,
          nameEn: true,
          nameSi: true,
          reorderLevel: true,
          unit: true,
          warehouseId: true,
        },
      },
    },
    take: 500,
  });

  const filtered = inventoryRows.filter((inv) => inv.currentStock <= inv.item.reorderLevel);

  const byWarehouse = new Map<string, typeof filtered>();

  for (const inv of filtered) {
    const list = byWarehouse.get(inv.item.warehouseId) ?? [];
    list.push(inv);
    byWarehouse.set(inv.item.warehouseId, list);
  }

  for (const [warehouseId, items] of Array.from(byWarehouse.entries())) {
    const managers = await getWarehouseManagers(warehouseId);
    const emailItems = items.map((inv) => ({
      nameEn: inv.item.nameEn,
      currentStock: inv.currentStock,
      reorderLevel: inv.item.reorderLevel,
      unit: inv.item.unit,
    }));

    if (managers.length > 0) {
      await sendLowStockAlert(
        managers.map((m) => m.email),
        emailItems,
      );

      for (const manager of managers) {
        await createNotification({
          userId: manager.id,
          titleEn: `Low Stock Alert (${items.length} items)`,
          titleSi: `අඩු ස්ටොක් අනතුරු අඟවීම (${items.length} අයිතම)`,
          message: `${items.length} item(s) at or below reorder level.`,
          type: NotifType.LOW_STOCK,
          link: `${APP_URL}/inventory?filter=low-stock`,
        });
      }
    }

    await notifyWarehouse(warehouseId, {
      event: SOCKET_EVENTS.STOCK_LOW,
      warehouseId,
      count: items.length,
      items: items.map((inv) => ({
        itemId: inv.item.id,
        nameEn: inv.item.nameEn,
        nameSi: inv.item.nameSi,
        currentStock: inv.currentStock,
        reorderLevel: inv.item.reorderLevel,
      })),
    });
  }

  logger.info({ count: filtered.length }, "Low stock check completed");
}

/** Task due alerts — runs hourly. */
async function runTaskDueAlerts(): Promise<void> {
  logger.info("Running task due alerts");

  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const dueTasks = await prisma.task.findMany({
    where: {
      status: { in: [TaskStatus.PENDING, TaskStatus.IN_PROGRESS, TaskStatus.OVERDUE] },
      dueDate: { lte: in24h },
      completedAt: null,
    },
    include: {
      assignedTo: { select: { id: true, email: true, fullNameEn: true } },
    },
  });

  for (const task of dueTasks) {
    const isOverdue = task.dueDate < now;
    const status = isOverdue ? TaskStatus.OVERDUE : task.status;

    if (isOverdue && task.status !== TaskStatus.OVERDUE) {
      await prisma.task.update({
        where: { id: task.id },
        data: { status: TaskStatus.OVERDUE },
      });
    }

    await sendTaskDueReminder(
      task.assignedTo.email,
      task.titleEn,
      task.dueDate.toLocaleDateString("en-LK"),
    );

    await createNotification({
      userId: task.assignedTo.id,
      titleEn: isOverdue ? "Task Overdue" : "Task Due Soon",
      titleSi: isOverdue ? "කාර්යය කල් ඉකුත්" : "කාර්යය ඉක්මනින් ඉටු කරන්න",
      message: task.titleEn,
      type: NotifType.TASK_DUE,
      link: `${APP_URL}/staff/tasks`,
    });

    await notifyUser(task.assignedTo.id, {
      event: SOCKET_EVENTS.TASK_DUE,
      taskId: task.id,
      titleEn: task.titleEn,
      titleSi: task.titleSi,
      dueDate: task.dueDate.toISOString(),
      status,
    });
  }

  logger.info({ count: dueTasks.length }, "Task due alerts completed");
}

/** Scheduled reports — daily stock report at 06:00. */
async function runScheduledReports(): Promise<void> {
  logger.info("Running scheduled reports");

  const warehouses = await prisma.warehouse.findMany({
    where: { isActive: true },
    select: { id: true, nameEn: true, nameSi: true },
  });

  const systemUser = await prisma.user.findFirst({
    where: { role: Role.SUPER_ADMIN, isActive: true },
    select: { id: true },
  });

  if (!systemUser) {
    logger.warn("No super admin found for scheduled reports");
    return;
  }

  const now = new Date();
  const fromDate = new Date(now);
  fromDate.setDate(fromDate.getDate() - 1);
  fromDate.setHours(0, 0, 0, 0);
  const toDate = new Date(fromDate);
  toDate.setHours(23, 59, 59, 999);

  for (const warehouse of warehouses) {
    const reportNo = `RPT-DST-${warehouse.id.slice(-6).toUpperCase()}-${Date.now()}`;

    const report = await prisma.report.create({
      data: {
        reportNo,
        type: ReportType.DAILY_STOCK,
        titleEn: `Daily Stock Report — ${warehouse.nameEn}`,
        titleSi: `දෛනික ස්ටොක් වාර්තාව — ${warehouse.nameSi}`,
        warehouseId: warehouse.id,
        fromDate,
        toDate,
        generatedById: systemUser.id,
        metadata: { source: "worker", scheduled: true },
      },
    });

    const managers = await getWarehouseManagers(warehouse.id);
    for (const manager of managers) {
      await createNotification({
        userId: manager.id,
        titleEn: "Scheduled Report Ready",
        titleSi: "කාලසටහන් වාර්තාව සූදානම්",
        message: report.titleEn,
        type: NotifType.SYSTEM,
        link: `${APP_URL}/reports/${report.id}`,
      });
    }

    await notifyWarehouse(warehouse.id, {
      event: SOCKET_EVENTS.REPORT_READY,
      reportId: report.id,
      reportNo: report.reportNo,
      type: report.type,
    });
  }

  logger.info("Scheduled reports job completed");
}

function registerJobs(): void {
  cron.schedule("5 0 * * *", () => void runKpiSnapshot(), {
    timezone: "Asia/Colombo",
  });

  cron.schedule("0 */6 * * *", () => void runLowStockCheck(), {
    timezone: "Asia/Colombo",
  });

  cron.schedule("0 * * * *", () => void runTaskDueAlerts(), {
    timezone: "Asia/Colombo",
  });

  cron.schedule("0 6 * * *", () => void runScheduledReports(), {
    timezone: "Asia/Colombo",
  });

  logger.info("Worker cron jobs registered");
}

async function bootstrap(): Promise<void> {
  if (!WORKER_ENABLED) {
    logger.warn("Worker disabled via WORKER_ENABLED=false");
    return;
  }

  registerJobs();
  logger.info("IrrWMS worker started");

  const shutdown = async (signal: string) => {
    logger.info({ signal }, "Shutting down worker");
    await disconnectRedisClients();
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

bootstrap().catch((error) => {
  logger.error({ err: error }, "Worker failed to start");
  process.exit(1);
});
