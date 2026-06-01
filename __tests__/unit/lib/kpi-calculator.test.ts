import { describe, expect, it } from "vitest";
import {
  aggregateKpiRecords,
  buildKpiRecord,
  calculateAvgEntryTime,
  calculateErrorRate,
  calculateInventoryAccuracy,
  calculateOrderFulfillmentRate,
  calculatePickingEfficiency,
  calculateShrinkageRate,
  calculateStaffProductivity,
  calculateStockTurnoverRate,
  roundKpi,
  scoreKpiRecord,
} from "@/lib/utils/kpi-calculator";
import type { KPIRecord } from "@prisma/client";

describe("kpi-calculator", () => {
  describe("calculateInventoryAccuracy", () => {
    it("returns 100 when expected and counted match", () => {
      expect(calculateInventoryAccuracy(100, 100)).toBe(100);
    });

    it("returns 0 when expected is 0 and counted is non-zero", () => {
      expect(calculateInventoryAccuracy(0, 5)).toBe(0);
    });

    it("returns 100 when both are zero", () => {
      expect(calculateInventoryAccuracy(0, 0)).toBe(100);
    });

    it("computes variance-based accuracy", () => {
      expect(calculateInventoryAccuracy(100, 90)).toBe(90);
    });
  });

  describe("calculateAvgEntryTime", () => {
    it("returns 0 for empty entries", () => {
      expect(calculateAvgEntryTime([])).toBe(0);
    });

    it("ignores null and zero durations", () => {
      const avg = calculateAvgEntryTime([
        { entryDuration: 60, status: "APPROVED", type: "GOODS_RECEIVED" },
        { entryDuration: null, status: "APPROVED", type: "GOODS_RECEIVED" },
        { entryDuration: 0, status: "APPROVED", type: "GOODS_RECEIVED" },
        { entryDuration: 120, status: "APPROVED", type: "GOODS_RECEIVED" },
      ]);
      expect(avg).toBe(90);
    });
  });

  describe("calculateOrderFulfillmentRate", () => {
    it("returns 100 when total is zero", () => {
      expect(calculateOrderFulfillmentRate(0, 0)).toBe(100);
    });

    it("caps at 100 percent", () => {
      expect(calculateOrderFulfillmentRate(10, 5)).toBe(100);
    });

    it("computes fulfillment percentage", () => {
      expect(calculateOrderFulfillmentRate(80, 100)).toBe(80);
    });
  });

  describe("calculateStockTurnoverRate", () => {
    it("returns 0 when average inventory is zero", () => {
      expect(calculateStockTurnoverRate(1000, 0)).toBe(0);
    });

    it("computes turnover ratio", () => {
      expect(calculateStockTurnoverRate(5000, 10000)).toBe(0.5);
    });
  });

  describe("calculateStaffProductivity", () => {
    it("returns 0 when staff hours is zero", () => {
      expect(calculateStaffProductivity(100, 0)).toBe(0);
    });

    it("computes lines per hour", () => {
      expect(calculateStaffProductivity(120, 8)).toBe(15);
    });
  });

  describe("calculateShrinkageRate", () => {
    it("returns 0 when total inventory value is zero", () => {
      expect(calculateShrinkageRate(50, 0)).toBe(0);
    });

    it("computes shrinkage percentage", () => {
      expect(calculateShrinkageRate(100, 10000)).toBe(1);
    });
  });

  describe("calculatePickingEfficiency", () => {
    it("returns 0 when picking hours is zero", () => {
      expect(calculatePickingEfficiency(50, 0)).toBe(0);
    });

    it("computes lines picked per hour", () => {
      expect(calculatePickingEfficiency(240, 4)).toBe(60);
    });
  });

  describe("calculateErrorRate", () => {
    it("returns 0 when no transactions", () => {
      expect(calculateErrorRate(5, 0)).toBe(0);
    });

    it("computes error percentage", () => {
      expect(calculateErrorRate(2, 200)).toBe(1);
    });
  });

  describe("buildKpiRecord", () => {
    it("rounds numeric fields", () => {
      const record = buildKpiRecord({
        inventoryAccuracy: 99.456,
        avgEntryTime: 45.678,
        orderFulfillmentRate: 97.891,
        stockTurnoverRate: 1.2345,
        staffProductivity: 12.345,
        shrinkageRate: 0.567,
        pickingEfficiency: 55.555,
        totalTransactions: 99.7,
        totalErrors: 1.2,
      });

      expect(record.inventoryAccuracy).toBe(99.46);
      expect(record.totalTransactions).toBe(100);
      expect(record.totalErrors).toBe(1);
    });
  });

  describe("roundKpi", () => {
    it("rounds to specified decimals", () => {
      expect(roundKpi(3.14159, 3)).toBe(3.142);
    });
  });

  describe("scoreKpiRecord", () => {
    it("assigns status based on targets", () => {
      const record = {
        inventoryAccuracy: 98,
        orderFulfillmentRate: 96,
        pickingEfficiency: 50,
        shrinkageRate: 3,
      } as KPIRecord;

      const scorecard = scoreKpiRecord(record);
      expect(scorecard.length).toBeGreaterThan(0);
      expect(
        scorecard.some(
          (m) => m.status === "good" || m.status === "warning" || m.status === "critical",
        ),
      ).toBe(true);
    });
  });

  describe("aggregateKpiRecords", () => {
    it("returns empty object for no records", () => {
      expect(aggregateKpiRecords([])).toEqual({});
    });

    it("averages KPI values across records", () => {
      const base = {
        id: "1",
        warehouseId: "wh1",
        recordDate: new Date(),
        month: 6,
        year: 2026,
        stockTurnoverRate: 1,
        staffProductivity: 10,
        shrinkageRate: 1,
        pickingEfficiency: 50,
        totalTransactions: 100,
        totalErrors: 2,
        createdAt: new Date(),
      };

      const result = aggregateKpiRecords([
        { ...base, inventoryAccuracy: 98, avgEntryTime: 40, orderFulfillmentRate: 96 },
        { ...base, inventoryAccuracy: 96, avgEntryTime: 60, orderFulfillmentRate: 94 },
      ] as KPIRecord[]);

      expect(result.inventoryAccuracy).toBe(97);
      expect(result.avgEntryTime).toBe(50);
    });
  });
});
