// src/schemas/userSchemas.ts
import { z } from "zod";

export const suspendStudentSchema = z.object({
  student: z.string(),
});

export const commonStudentsSchema = z.object({
  teacher: z.union([z.string(), z.array(z.string())]),
});

export const registerStudentSchema = z.object({
  teacher: z.string(),
  students: z.string().array(),
});

export const retrieveNotificationsSchema = z.object({
  teacher: z.string(),
  notification: z.string(),
});
