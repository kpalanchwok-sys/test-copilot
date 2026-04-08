import mongoose, { Document, Schema } from "mongoose";

export interface IAlert extends Document {
  contactId: mongoose.Types.ObjectId;
  createdBy?: mongoose.Types.ObjectId;
  isRead: boolean;
}

const alertSchema = new Schema<IAlert>(
  {
    contactId: {
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

const Alert = mongoose.model<IAlert>("Alert", alertSchema);
export default Alert;
