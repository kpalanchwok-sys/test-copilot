import mongoose, { Document, Schema } from "mongoose";

export interface IUserDevice extends Document {
  userId: mongoose.Types.ObjectId;
  deviceId: string;
  appVersion: string;
  platform: string;
  osVersion?: string;
  deviceModel?: string;
}

const userDeviceSchema = new Schema<IUserDevice>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    deviceId: { type: String, required: true },
    appVersion: { type: String, required: true },
    platform: { type: String, required: true },
    osVersion: String,
    deviceModel: String,
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

export const UserDevice = mongoose.model<IUserDevice>(
  "UserDevice",
  userDeviceSchema,
);
