import { create } from "zustand";
import { createAuthSlice, type AuthSlice } from "./slices/authSlice";
import { createFiltersSlice, type FiltersSlice } from "./slices/filtersSlice";
import { createSidebarSlice, type SidebarSlice } from "./slices/sidebarSlice";
import { createUiSlice, type UiSlice } from "./slices/uiSlice";

export type AppStore = AuthSlice & UiSlice & FiltersSlice & SidebarSlice;

export const useAppStore = create<AppStore>()((...args) => ({
  ...createAuthSlice(...args),
  ...createUiSlice(...args),
  ...createFiltersSlice(...args),
  ...createSidebarSlice(...args),
}));
