import mongoose, { Document, Schema } from "mongoose";

export interface IOrderSticker extends Document {
  qrCodeId: string;

  name: string;

  streetAddress?: string;
  city?: string;
  county?: string;
  postalCode?: string;
  country?: string;

  mobileNumber: string;

  stickerQuantity: number;
}

const orderStickerSchema = new Schema<IOrderSticker>(
  {
    qrCodeId: {
      type: String,
      required: true,
      unique: true, // one QR → one owner
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    streetAddress: String,
    city: String,
    county: String,
    postalCode: String,
    country: String,

    mobileNumber: {
      type: String,
      required: true,
    },

    stickerQuantity: {
      type: Number,
      default: 1,
      min: 1,
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

export const OrderSticker = mongoose.model<IOrderSticker>(
  "OrderSticker",
  orderStickerSchema,
);
