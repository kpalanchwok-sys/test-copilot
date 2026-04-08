import mongoose, { Document, Schema } from "mongoose";

interface IReview {
  id: string;
  username: string;
  rating: number;
  comment: string;
  date: Date;
}

export interface ISiteDetail extends Document {
  name: string;
  location: string;
  googleLocation?: string;
  category?: string;
  distance?: number;
  openingHours?: string;
  fees?: number;
  userRating?: number;
  contact?: string;
  description?: string;
  reviews: IReview[];
}

const reviewSchema = new Schema<IReview>(
  {
    id: { type: String, required: true },
    username: { type: String, required: true },
    rating: { type: Number, required: true, min: 0 },
    comment: { type: String },
    date: { type: Date, default: Date.now },
  },
  { _id: false },
);

const siteDetailSchema = new Schema<ISiteDetail>(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    googleLocation: String,
    category: String,
    distance: Number,
    openingHours: String,
    fees: Number,
    userRating: { type: Number, default: 0 },
    contact: String,
    description: String,
    reviews: { type: [reviewSchema], default: [] },
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

export const SiteDetail = mongoose.model<ISiteDetail>(
  "SiteDetail",
  siteDetailSchema,
);
