import type { StateCreator } from "zustand";

export type DateRangeFilter = {
  from: string | null;
  to: string | null;
};

export type FiltersSlice = {
  warehouseId: string | null;
  searchQuery: string;
  dateRange: DateRangeFilter;
  statusFilter: string | null;
  setWarehouseId: (warehouseId: string | null) => void;
  setSearchQuery: (searchQuery: string) => void;
  setDateRange: (dateRange: DateRangeFilter) => void;
  setStatusFilter: (statusFilter: string | null) => void;
  resetFilters: () => void;
};

const defaultDateRange: DateRangeFilter = {
  from: null,
  to: null,
};

export const createFiltersSlice: StateCreator<FiltersSlice> = (set) => ({
  warehouseId: null,
  searchQuery: "",
  dateRange: defaultDateRange,
  statusFilter: null,
  setWarehouseId: (warehouseId) => set({ warehouseId }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setDateRange: (dateRange) => set({ dateRange }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  resetFilters: () =>
    set({
      warehouseId: null,
      searchQuery: "",
      dateRange: defaultDateRange,
      statusFilter: null,
    }),
});
