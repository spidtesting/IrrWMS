import { z } from "zod";
import { Role } from "@prisma/client";
import { cuidSchema, optionalCuidSchema, paginationSchema } from "@/lib/validations/common";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[0-9]/, "Password must contain a number")
  .regex(/[^A-Za-z0-9]/, "Password must contain a special character");

export const createUserSchema = z.object({
  employeeId: z.string().min(3).max(20),
  fullNameEn: z.string().min(2).max(255),
  fullNameSi: z.string().min(2).max(255),
  email: z.string().email(),
  password: passwordSchema,
  role: z.nativeEnum(Role).default(Role.STAFF),
  warehouseId: optionalCuidSchema,
  isActive: z.boolean().default(true),
});

export const updateUserSchema = z.object({
  id: cuidSchema,
  employeeId: z.string().min(3).max(20).optional(),
  fullNameEn: z.string().min(2).max(255).optional(),
  fullNameSi: z.string().min(2).max(255).optional(),
  email: z.string().email().optional(),
  password: passwordSchema.optional(),
  role: z.nativeEnum(Role).optional(),
  warehouseId: optionalCuidSchema,
  isActive: z.boolean().optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const userQuerySchema = paginationSchema.extend({
  role: z.nativeEnum(Role).optional(),
  warehouseId: cuidSchema.optional(),
  isActive: z.coerce.boolean().optional(),
  search: z.string().trim().max(100).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
