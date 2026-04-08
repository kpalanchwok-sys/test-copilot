import mongoose, { Schema } from "mongoose";
import { IBoat, IFile } from "../interfaces/IBoat";

const fileSchema = new Schema<IFile>({
  fileName: { type: String, required: true },
  fileUrl: { type: String },
  contentType: { type: String, required: true },
  fileSize: { type: Number },
  status: { type: String, enum: ["pending", "Done"], default: "pending" },
});

const boatSchema = new Schema<IBoat>(
  {
    boatName: { type: String, required: true, trim: true },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    type: String,
    make: String,
    model: String,
    serialNumber: String,
    year: String,

    length: String,
    beam: Number,
    draft: Number,
    airDraft: Number,

    homeMarina: String,
    mooringLocation: String,

    status: {
      type: String,
      enum: ["Active", "Inactive", "Maintenance", "Sold"],
      default: "Active",
    },

    ownerName: String,
    contactEmail: { type: String, lowercase: true },

    images: [fileSchema],
    documents: [fileSchema],

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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
const Boat = mongoose.model<IBoat>("Boat", boatSchema);
export default Boat;
