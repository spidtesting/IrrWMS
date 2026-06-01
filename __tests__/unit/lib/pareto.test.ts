import { describe, expect, it } from "vitest";
import {
  calculatePareto,
  classifyAbc,
  paretoFromInventory,
  type ParetoItem,
} from "@/lib/utils/pareto";

const sampleItems: ParetoItem[] = [
  { id: "a", label: "Item A", value: 500 },
  { id: "b", label: "Item B", value: 300 },
  { id: "c", label: "Item C", value: 150 },
  { id: "d", label: "Item D", value: 50 },
];

describe("pareto", () => {
  describe("calculatePareto", () => {
    it("returns empty result when all values are zero", () => {
      const result = calculatePareto([{ id: "x", label: "X", value: 0 }]);
      expect(result.items).toHaveLength(0);
      expect(result.totalValue).toBe(0);
    });

    it("sorts items by value descending", () => {
      const result = calculatePareto(sampleItems);
      expect(result.items[0]?.id).toBe("a");
      expect(result.items[1]?.id).toBe("b");
    });

    it("computes cumulative percentages", () => {
      const result = calculatePareto(sampleItems, 80);
      expect(result.totalValue).toBe(1000);
      expect(result.items[0]?.cumulativePercent).toBe(50);
      expect(result.items[1]?.cumulativePercent).toBe(80);
    });

    it("marks vital few items at 80% cutoff", () => {
      const result = calculatePareto(sampleItems, 80);
      const vitalFew = result.items.filter((i) => i.isVitalFew);
      expect(vitalFew.length).toBe(2);
    });

    it("sets cutoff index when threshold is reached", () => {
      const result = calculatePareto(sampleItems, 80);
      expect(result.cutoffIndex).toBe(1);
    });
  });

  describe("classifyAbc", () => {
    it("assigns A, B, and C classes", () => {
      const classified = classifyAbc(sampleItems);
      expect(classified.some((i) => i.class === "A")).toBe(true);
      expect(classified.every((i) => ["A", "B", "C"].includes(i.class))).toBe(true);
    });
  });

  describe("paretoFromInventory", () => {
    const records = [
      {
        itemId: "1",
        label: "Pipe 4in",
        unitPrice: 100,
        currentStock: 50,
        issueCount: 10,
      },
      {
        itemId: "2",
        label: "Valve",
        unitPrice: 200,
        currentStock: 20,
        issueCount: 30,
      },
    ];

    it("builds value metric by default", () => {
      const items = paretoFromInventory(records);
      expect(items[0]?.value).toBe(5000);
      expect(items[1]?.value).toBe(4000);
    });

    it("supports quantity metric", () => {
      const items = paretoFromInventory(records, "quantity");
      expect(items.find((i) => i.id === "1")?.value).toBe(50);
    });

    it("supports frequency metric", () => {
      const items = paretoFromInventory(records, "frequency");
      expect(items.find((i) => i.id === "2")?.value).toBe(30);
    });
  });
});
