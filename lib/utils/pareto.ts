export type ParetoItem = {
  id: string;
  label: string;
  value: number;
  quantity?: number;
  frequency?: number;
};

export type ParetoResult = {
  items: ParetoEnrichedItem[];
  totalValue: number;
  cutoffIndex: number | null;
  cutoffPercent: number;
};

export type ParetoEnrichedItem = ParetoItem & {
  cumulativeValue: number;
  cumulativePercent: number;
  rank: number;
  isVitalFew: boolean;
};

const DEFAULT_CUTOFF = 80;

export function calculatePareto(items: ParetoItem[], cutoffPercent = DEFAULT_CUTOFF): ParetoResult {
  const sorted = [...items].filter((item) => item.value > 0).sort((a, b) => b.value - a.value);

  const totalValue = sorted.reduce((sum, item) => sum + item.value, 0);

  if (totalValue === 0) {
    return {
      items: [],
      totalValue: 0,
      cutoffIndex: null,
      cutoffPercent,
    };
  }

  let cumulative = 0;
  let cutoffIndex: number | null = null;

  const enriched: ParetoEnrichedItem[] = sorted.map((item, index) => {
    cumulative += item.value;
    const cumulativePercent = (cumulative / totalValue) * 100;

    if (cutoffIndex === null && cumulativePercent >= cutoffPercent) {
      cutoffIndex = index;
    }

    return {
      ...item,
      rank: index + 1,
      cumulativeValue: cumulative,
      cumulativePercent: round(cumulativePercent),
      isVitalFew: cumulativePercent <= cutoffPercent,
    };
  });

  return {
    items: enriched,
    totalValue,
    cutoffIndex,
    cutoffPercent,
  };
}

export function classifyAbc(items: ParetoItem[]): Array<ParetoItem & { class: "A" | "B" | "C" }> {
  const pareto = calculatePareto(items, 80);
  const classBThreshold = 95;

  return pareto.items.map((item) => {
    let cls: "A" | "B" | "C";
    if (item.cumulativePercent <= 80) cls = "A";
    else if (item.cumulativePercent <= classBThreshold) cls = "B";
    else cls = "C";

    return { ...item, class: cls };
  });
}

export function paretoFromInventory(
  records: Array<{
    itemId: string;
    label: string;
    unitPrice: number;
    currentStock: number;
    issueCount?: number;
  }>,
  metric: "value" | "quantity" | "frequency" = "value",
): ParetoItem[] {
  return records.map((r) => ({
    id: r.itemId,
    label: r.label,
    value:
      metric === "value"
        ? r.unitPrice * r.currentStock
        : metric === "quantity"
          ? r.currentStock
          : (r.issueCount ?? 0),
    quantity: r.currentStock,
    frequency: r.issueCount,
  }));
}

function round(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
