import type { StateCreator } from "zustand";

export type UiSlice = {
  language: "en" | "si";
  isGlobalLoading: boolean;
  setLanguage: (language: "en" | "si") => void;
  setGlobalLoading: (loading: boolean) => void;
};

export const createUiSlice: StateCreator<UiSlice> = (set) => ({
  language: "en",
  isGlobalLoading: false,
  setLanguage: (language) => set({ language }),
  setGlobalLoading: (isGlobalLoading) => set({ isGlobalLoading }),
});
