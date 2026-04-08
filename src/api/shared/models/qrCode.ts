import mongoose, { Document, Schema } from "mongoose";

export interface IQrCodes extends Document {
  boatId: string;
}

const qrCodesSchema = new Schema<IQrCodes>(
  {
    boatId: {
      type: String,
      required: true,
      unique: true,
      index: true,
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

const QrCodes = mongoose.model<IQrCodes>("QrCodes", qrCodesSchema);
export default QrCodes;
