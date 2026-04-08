import mongoose, { Document, Schema } from "mongoose";

interface IReview {
  username: string;
  rating: number;
  comment?: string;
  date: Date;
}

export interface IMarina extends Document {
  name: string;
  location: string;
  googleLocation?: string;

  distance?: number;

  mooringSpaceCount?: number;

  fuelAvailable: boolean;
  shower: boolean;
  portableWater: boolean;

  openingHours?: string;
  contact?: string;
  website?: string;

  userRating?: number;

  description?: string;

  reviews: IReview[];
}

const reviewSchema = new Schema<IReview>(
  {
    username: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
    date: { type: Date, default: Date.now },
  },
  { _id: true },
);

const marinaSchema = new Schema<IMarina>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
    },

    googleLocation: String,

    distance: Number,

    mooringSpaceCount: Number,

    fuelAvailable: { type: Boolean, default: false },
    shower: { type: Boolean, default: false },
    portableWater: { type: Boolean, default: false },

    openingHours: String,
    contact: String,
    website: String,

    userRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    description: String,

    reviews: {
      type: [reviewSchema],
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

// Index for search
marinaSchema.index({ name: "text", location: "text" });

const Marina = mongoose.model<IMarina>("Marina", marinaSchema);

export default Marina;
