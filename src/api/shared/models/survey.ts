import mongoose, { Document, Schema } from "mongoose";

interface IMedia {
  fileName: string;
  fileUrl: string;
  contentType?: string;
  fileSize?: number;
  status: string;
}

export interface ISurvey extends Document {
  boatId: mongoose.Types.ObjectId;
  name: string;
  dueDate: Date;
  lastDate?: Date;
  interval?: string;
  surveyor?: string;
  reminderDate?: Date;
  location?: string;
  notes?: string;
  links: string[];
  images: IMedia[];
  videos: IMedia[];
  documents: IMedia[];
}

const mediaSchema = new Schema<IMedia>({
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  contentType: String,
  fileSize: Number,
  status: String,
});

const surveySchema = new Schema<ISurvey>(
  {
    boatId: {
      type: Schema.Types.ObjectId,
      ref: "Boat",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    dueDate: { type: Date, required: true },
    lastDate: Date,
    interval: String,
    surveyor: String,
    reminderDate: Date,
    location: String,
    notes: String,
    links: { type: [String], default: [] },
    images: { type: [mediaSchema], default: [] },
    videos: { type: [mediaSchema], default: [] },
    documents: { type: [mediaSchema], default: [] },
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

const Survey = mongoose.model<ISurvey>("Survey", surveySchema);
export default Survey;
