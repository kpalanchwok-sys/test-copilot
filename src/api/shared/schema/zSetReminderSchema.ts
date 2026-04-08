import { z } from "zod";
import {
  ASSIGN_SHARE_REMINDER_VALUES,
  REPEAT_SETTING_VALUES,
  SET_REMINDER_BEFORE_VALUES,
} from "../models/setReminder";

export const setReminderSchema = z.object({
  dueDate: z.coerce.date({ message: "Invalid date for dueDate" }),
  setReminderBefore: z.enum(SET_REMINDER_BEFORE_VALUES).optional(),
  assignShareReminder: z.enum(ASSIGN_SHARE_REMINDER_VALUES).optional(),
  assignShareReminderUserId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
  maintenanceItemId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  email: z.array(z.string().email("Invalid email format")).optional(),
  repeatSetting: z.enum(REPEAT_SETTING_VALUES).optional(),
});

export const setReminderUpdateSchema = setReminderSchema.partial();

export const setReminderParamsSchema = z.object({
  setReminderId: z
    .string({ message: "ID is required" })
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid Object-Id format" }),
});
