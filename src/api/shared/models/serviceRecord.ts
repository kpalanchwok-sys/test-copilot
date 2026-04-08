import mongoose, { Document, Schema, Types } from "mongoose";

export interface IServiceRecord extends Document {
  boatId: Types.ObjectId;

  name: string;
  status: string;

  date: Date;

  performedBy?: string;

  engineHours?: number;

  type?: string;

  notes?: string;

  documents: string[];
  createdAt: Date;
  updatedAt: Date;
}

const serviceRecordSchema = new Schema<IServiceRecord>(
  {
    boatId: {
      type: Schema.Types.ObjectId,
      ref: "Boat",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["scheduled", "in_progress", "completed", "cancelled"],
      default: "completed",
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    performedBy: String,

    engineHours: {
      type: Number,
      min: 0,
    },

    type: {
      type: String,
      enum: ["engine", "hull", "electrical", "general", "inspection"],
      default: "general",
    },

    notes: String,

    documents: {
      type: [String],
      default: [],
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

serviceRecordSchema.index({ boatId: 1, date: -1 });

export const ServiceRecord = mongoose.model<IServiceRecord>(
  "ServiceRecord",
  serviceRecordSchema,
);
