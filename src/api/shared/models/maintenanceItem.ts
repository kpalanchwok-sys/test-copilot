import mongoose, { Document, Schema } from "mongoose";

export interface IFile {
  fileName: string;
  fileUrl: string;
  contentType: string;
  fileSize?: number;
  status: string;
}
const fileSchema = new Schema<IFile>({
  fileName: { type: String, required: true },
  fileUrl: { type: String },
  contentType: { type: String, required: true },
  fileSize: { type: Number },
  status: { type: String },
});
export interface IBoatIssue extends Document {
  boatId: mongoose.Types.ObjectId;

  images: string[];
  videos: string[];
  documents: string[];
  youtubeLinks: string[];

  title: string;
  description?: string;

  priority: string;
  status: string;

  reportedBy?: string;

  dateReported: Date;
  resolvedAt?: Date;
}

const boatIssueSchema = new Schema<IBoatIssue>(
  {
    boatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boat",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: String,

    priority: {
      type: String,
    },

    status: {
      type: String,
    },

    reportedBy: String,
    youtubeLinks: [String],

    dateReported: {
      type: Date,
      required: true,
      default: Date.now,
    },

    resolvedAt: Date,

    images: [fileSchema],
    videos: [fileSchema],
    documents: [fileSchema],
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

// // Index for filtering
// boatIssueSchema.index({ boatId: 1, status: 1 });
// boatIssueSchema.index({ title: "text", description: "text" });

boatIssueSchema.virtual("hasMaintenanceItemSet", {
  ref: "SetReminder",
  localField: "_id",
  foreignField: "maintenanceItemId",
  count: true, // 👈 returns number instead of docs
});

boatIssueSchema.virtual("maintenanceItemReminders", {
  ref: "SetReminder",
  localField: "_id",
  foreignField: "maintenanceItemId",
});

const MaintenanceItem = mongoose.model<IBoatIssue>(
  "MaintenanceItem",
  boatIssueSchema,
);
export default MaintenanceItem;
