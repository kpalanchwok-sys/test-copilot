import mongoose, { Document, Schema } from "mongoose";

export const SET_REMINDER_BEFORE_VALUES = ["1 week", "3 days"] as const;
export const REPEAT_SETTING_VALUES = ["6 month", "12 month"] as const;
export const ASSIGN_SHARE_REMINDER_VALUES = ["myself", "other"] as const;

export interface ISetReminder extends Document {
  dueDate: Date;
  setReminderBefore?: (typeof SET_REMINDER_BEFORE_VALUES)[number];
  assignShareReminder?: (typeof ASSIGN_SHARE_REMINDER_VALUES)[number];
  assignShareReminderUserId?: mongoose.Types.ObjectId;
  maintenanceItemId?: mongoose.Types.ObjectId;
  eventId?: mongoose.Types.ObjectId;
  email?: string[];
  repeatSetting?: (typeof REPEAT_SETTING_VALUES)[number];
  lastReminderSentAt?: Date;
  createdBy?: mongoose.Types.ObjectId;
}

const setReminderSchema = new Schema<ISetReminder>(
  {
    dueDate: {
      type: Date,
      required: true,
    },
    setReminderBefore: {
      type: String,
      trim: true,
      enum: SET_REMINDER_BEFORE_VALUES,
    },
    assignShareReminder: {
      type: String,
      trim: true,
      enum: ASSIGN_SHARE_REMINDER_VALUES,
    },
    assignShareReminderUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    email: {
      type: [String],
    },
    repeatSetting: {
      type: String,
      trim: true,
      enum: REPEAT_SETTING_VALUES,
    },
    lastReminderSentAt: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    maintenanceItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MaintenanceItem",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc: any, ret: Record<string, any>) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

const SetReminder = mongoose.model<ISetReminder>(
  "SetReminder",
  setReminderSchema,
);

export default SetReminder;
