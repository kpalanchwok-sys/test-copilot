import mongoose, { Document, Schema } from "mongoose";

export interface IEnrolments extends Document {
  courseId: mongoose.Types.ObjectId;
  createdBy?: mongoose.Types.ObjectId;
  isRead: boolean;
}

const enrolmentsSchema = new Schema<IEnrolments>(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      //   ref: "Contact",
      //   required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
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

const Enrolments = mongoose.model<IEnrolments>("Enrolments", enrolmentsSchema);
export default Enrolments;
