import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
  title: string;
  dueDateAndTime: Date;
  reminder?: string;
  category?: string[];
  shareTaskWithColleagues?: string[];
  notes?: string;
  categoryColor?: string;
  createdBy?: mongoose.Types.ObjectId;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    dueDateAndTime: {
      type: Date,
      required: true,
    },
    reminder: {
      type: String,
      trim: true,
    },
    category: {
      type: [String],
      trim: true,
    },
    shareTaskWithColleagues: {
      type: [String],
      // default: false,
      select: false,
    },
    notes: {
      type: String,
      trim: true,
    },
    categoryColor: {
      type: String,
      trim: true,
    },
    createdBy: {
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

const Task = mongoose.model<ITask>("Task", taskSchema);

export default Task;
