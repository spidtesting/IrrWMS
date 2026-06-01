import type { StateCreator } from "zustand";
import type { SessionUser } from "@/types/auth";

export type AuthSlice = {
  user: SessionUser | null;
  isAuthenticated: boolean;
  setUser: (user: SessionUser | null) => void;
  clearUser: () => void;
};

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) =>
    set({
      user,
      isAuthenticated: user !== null,
    }),
  clearUser: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
});
