export const USER_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "MANAGER",
  "SUPERVISOR",
  "STAFF",
  "VIEWER",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: UserRole;
  warehouseId: string | null;
  fullNameEn: string;
  fullNameSi: string;
  employeeId: string;
};

export type AuthenticatedContext = {
  user: SessionUser;
};
