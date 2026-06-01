import type { StateCreator } from "zustand";

export type SidebarSlice = {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
  setMobileOpen: (open: boolean) => void;
  toggleMobileOpen: () => void;
};

export const createSidebarSlice: StateCreator<SidebarSlice> = (set) => ({
  isCollapsed: false,
  isMobileOpen: false,
  toggleCollapsed: () =>
    set((state) => ({
      isCollapsed: !state.isCollapsed,
    })),
  setCollapsed: (isCollapsed) => set({ isCollapsed }),
  setMobileOpen: (isMobileOpen) => set({ isMobileOpen }),
  toggleMobileOpen: () =>
    set((state) => ({
      isMobileOpen: !state.isMobileOpen,
    })),
});
