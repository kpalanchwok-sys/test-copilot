import mongoose, { Document, Schema } from "mongoose";

interface IFile {
  fileName: string;
  fileUrl: string;
  contentType: string;
  fileSize: number;
  status: string;
}
interface IComment {
  _id?: mongoose.Types.ObjectId;
  commenter: mongoose.Types.ObjectId;
  text: string;
}

export interface IBoatProject extends Document {
  projectName: string;
  boatId: mongoose.Types.ObjectId;
  category: string[];
  type?: string;
  notes?: string;
  startDate?: Date;
  comments: IComment[];
  images: IFile[];
  createdBy?: mongoose.Types.ObjectId;
}

const fileSchema = new Schema<IFile>({
  fileName: String,
  fileUrl: String,
  contentType: String,
  fileSize: Number,
  status: String,
});

const commentSchema = new Schema<IComment>(
  {
    commenter: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    _id: true,
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

const boatProjectSchema = new Schema<IBoatProject>(
  {
    boatId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Boat",
    },
    projectName: {
      type: String,
      required: true,
    },
    category: [String],

    type: {
      type: String,
    },

    notes: String,
    startDate: Date,
    comments: [commentSchema],

    images: [fileSchema],

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

const BoatProject = mongoose.model<IBoatProject>(
  "BoatProject",
  boatProjectSchema,
);
export default BoatProject;
