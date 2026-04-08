import mongoose, { Document, Schema } from "mongoose";

export interface IUserDevice extends Document {
  userId: mongoose.Types.ObjectId;
  deviceId: string[];
  appVersion?: string;
  platform: "Android" | "iOS" | "Web";
  osVersion?: string;
  deviceModel?: string[];
  isActive: boolean;
  lastLoginAt?: Date;
}

const userDeviceSchema = new Schema<IUserDevice>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deviceId: {
      type: [String],
      required: true,
    },
    appVersion: String,
    platform: {
      type: String,
      enum: ["Android", "iOS", "Web"],
      required: true,
    },
    osVersion: String,
    deviceModel: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: Date,
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

// Prevent duplicate device per user
userDeviceSchema.index({ userId: 1, deviceId: 1 }, { unique: true });

const UserDeviceVersion = mongoose.model<IUserDevice>(
  "UserDeviceVersion",
  userDeviceSchema,
);

export default UserDeviceVersion;
