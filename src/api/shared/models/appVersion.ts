import mongoose, { Document, Schema } from "mongoose";

export interface IAppVersion extends Document {
  platform: "Android" | "iOS";
  version: string;
  forceUpdate: boolean;
  changeLogs: string[];
  isActive: boolean;
  createdBy?: mongoose.Types.ObjectId;
}

const appVersionSchema = new Schema<IAppVersion>(
  {
    platform: {
      type: String,
      enum: ["Android", "iOS"],
      required: true,
    },
    version: {
      type: String,
      required: true,
    },
    forceUpdate: {
      type: Boolean,
      default: false,
    },
    changeLogs: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true },
);

// Only one active version per platform
appVersionSchema.index(
  { platform: 1, isActive: 1 },
  { unique: true, partialFilterExpression: { isActive: true } },
);

const AppVersion = mongoose.model<IAppVersion>("AppVersion", appVersionSchema);

export default AppVersion;
