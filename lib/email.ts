import { Resend } from "resend";
import { env } from "@/config/env";
import { logger } from "@/lib/logger";

let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  if (!env.RESEND_API_KEY) {
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(env.RESEND_API_KEY);
  }
  return resendClient;
}

export type EmailPayload = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  tags?: Array<{ name: string; value: string }>;
};

export type EmailResult = {
  id: string;
};

export async function sendEmail(payload: EmailPayload): Promise<EmailResult | null> {
  const resend = getResendClient();
  if (!resend) {
    logger.warn({ to: payload.to }, "Email skipped: RESEND_API_KEY not configured");
    return null;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      replyTo: payload.replyTo,
      tags: payload.tags,
    });

    if (error) {
      logger.error({ err: error, to: payload.to }, "Failed to send email");
      return null;
    }

    return data ? { id: data.id } : null;
  } catch (error) {
    logger.error({ err: error, to: payload.to }, "Email send exception");
    return null;
  }
}

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string,
  userName: string,
): Promise<EmailResult | null> {
  return sendEmail({
    to,
    subject: "IrrWMS — Password Reset Request",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset</h2>
        <p>Hello ${userName},</p>
        <p>You requested a password reset for your IrrWMS account. Click the link below to set a new password:</p>
        <p><a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#006633;color:#fff;text-decoration:none;border-radius:4px;">Reset Password</a></p>
        <p>This link expires in 1 hour. If you did not request this, please ignore this email.</p>
        <hr />
        <p style="font-size:12px;color:#666;">Irrigation Department Warehouse Management System</p>
      </div>
    `,
    text: `Hello ${userName},\n\nReset your password: ${resetUrl}\n\nThis link expires in 1 hour.`,
    tags: [{ name: "category", value: "password-reset" }],
  });
}

export async function sendLowStockAlert(
  to: string | string[],
  items: Array<{ nameEn: string; currentStock: number; reorderLevel: number; unit: string }>,
): Promise<EmailResult | null> {
  const rows = items
    .map(
      (item) =>
        `<tr><td>${item.nameEn}</td><td>${item.currentStock} ${item.unit}</td><td>${item.reorderLevel} ${item.unit}</td></tr>`,
    )
    .join("");

  return sendEmail({
    to,
    subject: `IrrWMS — Low Stock Alert (${items.length} items)`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px;">
        <h2>Low Stock Alert</h2>
        <p>The following items are at or below reorder level:</p>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;">
          <thead><tr><th>Item</th><th>Current</th><th>Reorder Level</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `,
    tags: [{ name: "category", value: "low-stock" }],
  });
}

export async function sendApprovalNeededEmail(
  to: string,
  documentType: string,
  documentNo: string,
  actionUrl: string,
): Promise<EmailResult | null> {
  return sendEmail({
    to,
    subject: `IrrWMS — Approval Required: ${documentType} ${documentNo}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px;">
        <h2>Approval Required</h2>
        <p>A ${documentType} (<strong>${documentNo}</strong>) is pending your approval.</p>
        <p><a href="${actionUrl}">Review Document</a></p>
      </div>
    `,
    tags: [{ name: "category", value: "approval" }],
  });
}

export async function sendTaskDueReminder(
  to: string,
  taskTitle: string,
  dueDate: string,
): Promise<EmailResult | null> {
  return sendEmail({
    to,
    subject: `IrrWMS — Task Due: ${taskTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px;">
        <h2>Task Reminder</h2>
        <p>Your task <strong>${taskTitle}</strong> is due on ${dueDate}.</p>
      </div>
    `,
    tags: [{ name: "category", value: "task-due" }],
  });
}

export async function sendKpiAlertEmail(
  to: string | string[],
  warehouseName: string,
  metrics: Array<{ label: string; value: number; target: number; unit: string }>,
): Promise<EmailResult | null> {
  const rows = metrics
    .map(
      (m) =>
        `<tr><td>${m.label}</td><td>${m.value}${m.unit}</td><td>${m.target}${m.unit}</td></tr>`,
    )
    .join("");

  return sendEmail({
    to,
    subject: `IrrWMS — KPI Alert: ${warehouseName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px;">
        <h2>KPI Alert — ${warehouseName}</h2>
        <p>The following KPIs are below target:</p>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;">
          <thead><tr><th>Metric</th><th>Actual</th><th>Target</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `,
    tags: [{ name: "category", value: "kpi-alert" }],
  });
}
