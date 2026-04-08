import mongoose, { Document, Schema } from "mongoose";

interface IMedia {
  fileName: string;
  fileUrl: string;
  contentType: string;
  fileSize: number;
}

export interface IMarketplace extends Document {
  name: string;
  location: string;
  googleLocation?: string;

  datePosted: Date;
  postedBy?: string;

  amount: number;
  previousAmount?: number;

  rating?: number;

  description?: string;

  category?: string;
  condition?: string;

  negotiable: boolean;
  premiumListing: boolean;

  status: string;

  images: IMedia[];
}

const mediaSchema = new Schema<IMedia>({
  fileName: String,
  fileUrl: String,
  contentType: String,
  fileSize: Number,
});

const marketplaceSchema = new Schema<IMarketplace>(
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

    datePosted: {
      type: Date,
      default: Date.now,
    },

    postedBy: String,

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    previousAmount: Number,

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    description: String,

    category: {
      type: String,
    },

    condition: {
      type: String,
    },

    negotiable: {
      type: Boolean,
      default: false,
    },

    premiumListing: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    images: {
      type: [mediaSchema],
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

// Indexes for search & sorting
marketplaceSchema.index({
  name: "text",
  description: "text",
  location: "text",
});
marketplaceSchema.index({ category: 1, status: 1 });

export const Marketplace = mongoose.model<IMarketplace>(
  "Marketplace",
  marketplaceSchema,
);
