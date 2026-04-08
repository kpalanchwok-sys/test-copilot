import mongoose, { Document, Schema } from "mongoose";

interface IComment {
  _id?: mongoose.Types.ObjectId;
  username: string;
  text: string;
  date: Date;
}

export interface IForum extends Document {
  subject: string;
  description?: string;
  username: string;
  date: Date;

  likeCount: number;
  comments: IComment[];

  createdBy?: mongoose.Types.ObjectId;
}

const commentSchema = new Schema<IComment>(
  {
    username: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true },
);

const forumSchema = new Schema<IForum>(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    username: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },

    likeCount: {
      type: Number,
      default: 0,
    },

    comments: [commentSchema],

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

const CommunityForum = mongoose.model<IForum>("CommunityForum", forumSchema);
export default CommunityForum;
