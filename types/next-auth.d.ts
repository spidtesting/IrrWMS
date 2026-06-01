import type { DefaultSession } from "next-auth";
import type { UserRole } from "@/types/auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      warehouseId: string | null;
      fullNameEn: string;
      fullNameSi: string;
      employeeId: string;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
    warehouseId?: string | null;
    fullNameEn?: string;
    fullNameSi?: string;
    employeeId?: string;
  }
}
