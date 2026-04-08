import mongoose, { Document, Schema } from "mongoose";

export interface ICommunityNewsView extends Document {
  newsId: mongoose.Types.ObjectId;
  sessionId: string;
  ipAddress?: string;
  userAgent?: string;
  userId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const communityNewsViewSchema = new Schema<ICommunityNewsView>(
  {
    newsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommunityNews",
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
    },
    ipAddress: { type: String },
    userAgent: { type: String },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

// Index for fast de-dup lookups
communityNewsViewSchema.index({ newsId: 1, sessionId: 1 }, { unique: true });

export const CommunityNewsView = mongoose.model<ICommunityNewsView>(
  "CommunityNewsView",
  communityNewsViewSchema,
);
