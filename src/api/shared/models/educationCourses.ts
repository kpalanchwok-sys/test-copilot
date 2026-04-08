import mongoose, { Document, Schema } from "mongoose";

export interface ICourse extends Document {
  courseTitle: string;
  institute?: string;
  dateRange?: string;

  fee?: number;
  rating?: number;

  location?: string;
  googleLocation?: string;

  duration?: string;
  time?: string;

  seats?: number;
  availability?: string;

  includes?: string;
  note?: string;
  description?: string;

  instructorName?: string;
  instructorDescription?: string;

  createdBy?: mongoose.Types.ObjectId;
}

const courseSchema = new Schema<ICourse>(
  {
    courseTitle: {
      type: String,
      required: true,
      trim: true,
    },
    institute: String,
    dateRange: String,

    fee: {
      type: Number,
      min: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    location: String,
    googleLocation: String,

    duration: String,
    time: String,

    seats: {
      type: Number,
      min: 0,
    },
    availability: {
      type: String,
      enum: ["available", "full", "upcoming"],
      default: "available",
    },

    includes: String,
    note: String,
    description: String,

    instructorName: String,
    instructorDescription: String,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
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

courseSchema.index({ courseTitle: "text", institute: "text" });

export const Course = mongoose.model<ICourse>("Course", courseSchema);
