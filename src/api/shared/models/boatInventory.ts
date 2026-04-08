import mongoose, { Document, Schema } from "mongoose";

interface IFile {
  fileName: string;
  fileUrl: string;
  contentType: string;
  fileSize: number;
  status: string;
}

export interface IBoatInventory extends Document {
  boatId: mongoose.Types.ObjectId;
  name: string;
  category?: string;
  quantity: number;
  status?: string;
  availability?: string;
  notes?: string;
  purchasedDate?: Date;
  warrantyExpires?: Date;

  images: IFile[];
  videos: IFile[];
  documents: IFile[];

  createdBy?: mongoose.Types.ObjectId;
}

const fileSchema = new Schema<IFile>({
  fileName: String,
  fileUrl: String,
  contentType: String,
  fileSize: Number,
  status: String,
});

const boatInventorySchema = new Schema<IBoatInventory>(
  {
    boatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boat",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: String,
    quantity: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      // enum: ["active", "damaged", "lost", "maintenance"],
      // default: "active",
    },
    availability: {
      type: String,
      // enum: ["available", "in-use", "reserved"],
      // default: "available",
    },
    notes: String,
    purchasedDate: Date,
    warrantyExpires: Date,

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

const BoatInventory = mongoose.model<IBoatInventory>(
  "BoatInventory",
  boatInventorySchema,
);
export default BoatInventory;
