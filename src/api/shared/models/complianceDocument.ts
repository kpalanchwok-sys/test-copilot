import mongoose, { Document, Schema } from "mongoose";

interface IFile {
  fileName: string;
  fileUrl: string;
  contentType: string;
  fileSize: number;
  status: string;
}

export interface IYouTubeLink {
  url: string;
}

export interface IComplianceDocument extends Document {
  youTubeLinks?: IYouTubeLink[];
  images: IFile[];
  videos: IFile[];
  documents: IFile[];
  createdBy?: mongoose.Types.ObjectId;
}

const fileSchema = new Schema<IFile>(
  {
    fileName: String,
    fileUrl: String,
    contentType: String,
    fileSize: Number,
    status: String,
  },
  {
    timestamps: true,
    _id: true,
  },
);

const youTubeLinkSchema = new Schema<IYouTubeLink>(
  {
    url: {
      type: String,
      required: true,
    },
  },
  {
    _id: true,
    timestamps: true,
  },
);

const complianceDocumentSchema = new Schema<IComplianceDocument>(
  {
    youTubeLinks: {
      type: [youTubeLinkSchema],
      default: [],
    },
    images: {
      type: [fileSchema],
      default: [],
    },
    videos: {
      type: [fileSchema],
      default: [],
    },
    documents: {
      type: [fileSchema],
      default: [],
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

const ComplianceDocument = mongoose.model<IComplianceDocument>(
  "ComplianceDocument",
  complianceDocumentSchema,
);

export default ComplianceDocument;
