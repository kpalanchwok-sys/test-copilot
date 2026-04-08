import mongoose, { Document, Schema } from "mongoose";

interface IFile {
  fileName: string;
  fileUrl: string;
  contentType: string;
  fileSize: number;
  status: string;
}

export interface ICommunityNews extends Document {
  subject: string;
  description?: string;
  date: Date;
  viewCount: number;

  images: IFile[];
  videos: IFile[];
  documents: IFile[];

  createdBy?: mongoose.Types.ObjectId;
  createdAt?: Date;
}

const fileSchema = new Schema<IFile>({
  fileName: String,
  fileUrl: String,
  contentType: String,
  fileSize: Number,
  status: String,
});

const discussionSchema = new Schema<ICommunityNews>(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },

    date: {
      type: Date,
      default: Date.now,
    },
    viewCount: {
      type: Number,
      default: 0,
    },

    images: [fileSchema],
    videos: [fileSchema],
    documents: [fileSchema],

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

export const CommunityNews = mongoose.model<ICommunityNews>(
  "CommunityNews",
  discussionSchema,
);
