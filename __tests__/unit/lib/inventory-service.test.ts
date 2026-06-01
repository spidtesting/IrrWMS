import { beforeEach, describe, expect, it, vi } from "vitest";
import { EntryStatus, TransactionType, TransferStatus } from "@prisma/client";
import { ConflictError, NotFoundError, ValidationError } from "@/lib/error-handler";

vi.mock("@/lib/logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

const mockTransaction = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: (fn: (tx: unknown) => Promise<unknown>) => mockTransaction(fn),
  },
}));

import {
  approveStockEntry,
  rejectStockEntry,
  executeStockTransfer,
} from "@/lib/stock/inventory-service";

type MockTx = {
  stockEntry: {
    findUnique: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    createMany: ReturnType<typeof vi.fn>;
  };
  inventory: {
    findUnique: ReturnType<typeof vi.fn>;
    updateMany: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
  };
  item: {
    findFirst: ReturnType<typeof vi.fn>;
  };
  stockTransfer: {
    create: ReturnType<typeof vi.fn>;
  };
  auditLog: {
    create: ReturnType<typeof vi.fn>;
  };
};

function createMockTx(): MockTx {
  return {
    stockEntry: {
      findUnique: vi.fn(),
      update: vi.fn(),
      createMany: vi.fn(),
    },
    inventory: {
      findUnique: vi.fn(),
      updateMany: vi.fn(),
      create: vi.fn(),
    },
    item: {
      findFirst: vi.fn(),
    },
    stockTransfer: {
      create: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  };
}

describe("inventory-service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("approveStockEntry", () => {
    it("throws NotFoundError when entry does not exist", async () => {
      mockTransaction.mockImplementation(async (fn) => {
        const tx = createMockTx();
        tx.stockEntry.findUnique.mockResolvedValue(null);
        return fn(tx);
      });

      await expect(approveStockEntry({ stockEntryId: "missing" }, "approver-1")).rejects.toThrow(
        NotFoundError,
      );
    });

    it("throws ConflictError when entry is not pending", async () => {
      mockTransaction.mockImplementation(async (fn) => {
        const tx = createMockTx();
        tx.stockEntry.findUnique.mockResolvedValue({
          id: "entry-1",
          status: EntryStatus.APPROVED,
          type: TransactionType.GOODS_RECEIVED,
          quantity: 10,
          itemId: "item-1",
          warehouseId: "wh-1",
        });
        return fn(tx);
      });

      await expect(approveStockEntry({ stockEntryId: "entry-1" }, "approver-1")).rejects.toThrow(
        ConflictError,
      );
    });

    it("approves inbound entry and updates inventory", async () => {
      const approvedEntry = {
        id: "entry-1",
        status: EntryStatus.APPROVED,
        entryNumber: "SE-001",
      };

      mockTransaction.mockImplementation(async (fn) => {
        const tx = createMockTx();
        tx.stockEntry.findUnique.mockResolvedValue({
          id: "entry-1",
          status: EntryStatus.PENDING,
          type: TransactionType.GOODS_RECEIVED,
          quantity: 10,
          itemId: "item-1",
          warehouseId: "wh-1",
          entryNumber: "SE-001",
          remarks: null,
          item: { id: "item-1" },
        });
        tx.inventory.findUnique.mockResolvedValue({
          id: "inv-1",
          currentStock: 100,
          reservedStock: 0,
          availableStock: 100,
          version: 1,
        });
        tx.inventory.updateMany.mockResolvedValue({ count: 1 });
        tx.stockEntry.update.mockResolvedValue(approvedEntry);
        tx.auditLog.create.mockResolvedValue({});
        return fn(tx);
      });

      const result = await approveStockEntry({ stockEntryId: "entry-1" }, "approver-1");

      expect(result).toEqual(approvedEntry);
    });
  });

  describe("rejectStockEntry", () => {
    it("rejects a pending entry with reason", async () => {
      const rejectedEntry = {
        id: "entry-1",
        status: EntryStatus.REJECTED,
      };

      mockTransaction.mockImplementation(async (fn) => {
        const tx = createMockTx();
        tx.stockEntry.findUnique.mockResolvedValue({
          id: "entry-1",
          status: EntryStatus.PENDING,
          warehouseId: "wh-1",
        });
        tx.stockEntry.update.mockResolvedValue(rejectedEntry);
        tx.auditLog.create.mockResolvedValue({});
        return fn(tx);
      });

      const result = await rejectStockEntry(
        { stockEntryId: "entry-1", reason: "Incorrect quantity" },
        "approver-1",
      );

      expect(result.status).toBe(EntryStatus.REJECTED);
    });
  });

  describe("executeStockTransfer", () => {
    it("throws when source and destination are the same", async () => {
      await expect(
        executeStockTransfer(
          {
            itemId: "item-1",
            fromWarehouseId: "wh-1",
            toWarehouseId: "wh-1",
            quantity: 5,
          },
          "user-1",
        ),
      ).rejects.toThrow(ValidationError);
    });

    it("creates transfer when stock is available", async () => {
      const transfer = {
        id: "trf-1",
        transferNo: "TRF-123",
        status: TransferStatus.RECEIVED,
      };

      mockTransaction.mockImplementation(async (fn) => {
        const tx = createMockTx();
        tx.item.findFirst.mockResolvedValue({ id: "item-1" });
        tx.inventory.findUnique
          .mockResolvedValueOnce({
            id: "inv-src",
            currentStock: 50,
            reservedStock: 0,
            availableStock: 50,
            version: 1,
          })
          .mockResolvedValueOnce({
            id: "inv-dest",
            currentStock: 10,
            reservedStock: 0,
            availableStock: 10,
            version: 1,
          });
        tx.inventory.updateMany.mockResolvedValue({ count: 1 });
        tx.stockTransfer.create.mockResolvedValue(transfer);
        tx.stockEntry.createMany.mockResolvedValue({ count: 2 });
        tx.auditLog.create.mockResolvedValue({});
        return fn(tx);
      });

      const result = await executeStockTransfer(
        {
          itemId: "item-1",
          fromWarehouseId: "wh-1",
          toWarehouseId: "wh-2",
          quantity: 5,
        },
        "user-1",
      );

      expect(result.id).toBe("trf-1");
    });
  });
});
