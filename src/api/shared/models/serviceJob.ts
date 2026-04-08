import mongoose, { Document, Schema } from "mongoose";

interface IMedia {
  fileName: string;
  fileUrl: string;
  contentType: string;
  fileSize: number;
}

export interface IServiceRequest extends Document {
  boatId: mongoose.Types.ObjectId;

  title: string;
  description?: string;

  status: string;

  location?: string;
  category?: string;

  preferredStartDate?: Date;
  preferredEndDate?: Date;

  minBudget?: number;
  maxBudget?: number;

  images: IMedia[];
  documents: IMedia[];

  serviceProviderId?: mongoose.Types.ObjectId;
}

const mediaSchema = new Schema<IMedia>(
  {
    fileName: String,
    fileUrl: String,
    contentType: String,
    fileSize: Number,
  },
  { _id: false },
);

const serviceRequestSchema = new Schema<IServiceRequest>(
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

    status: {
      type: String,
      enum: ["open", "in_progress", "assigned", "completed", "cancelled"],
      default: "open",
    },

    location: String,

    category: {
      type: String,
      enum: ["repair", "cleaning", "inspection", "installation", "other"],
      default: "other",
    },

    preferredStartDate: Date,
    preferredEndDate: Date,

    minBudget: Number,
    maxBudget: Number,

    images: {
      type: [mediaSchema],
      default: [],
    },

    documents: {
      type: [mediaSchema],
      default: [],
    },

    serviceProviderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

serviceRequestSchema.index({ boatId: 1, status: 1 });
serviceRequestSchema.index({ title: "text", description: "text" });

export const ServiceRequest = mongoose.model<IServiceRequest>(
  "ServiceRequest",
  serviceRequestSchema,
);
