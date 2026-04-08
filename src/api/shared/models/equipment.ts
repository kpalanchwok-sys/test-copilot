import mongoose, { Schema } from "mongoose";
import { IEquipment, IFile } from "../interfaces/IEquipment";

const fileSchema = new Schema<IFile>({
  fileName: String,
  fileUrl: String,
  contentType: String,
  fileSize: Number,
  status: String,
});

const equipmentSchema = new Schema<IEquipment>(
  {
    boatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boat",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: String,
    capacity: String,

    manufacturer: String,
    model: String,

    locationOnBoat: String,

    installDate: Date,
    lastServiced: Date,
    serviceFrequency: String,

    notes: String,

    youTubeUrl: {
      type: [String],
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

equipmentSchema.index({ boatId: 1 });
equipmentSchema.index({ name: "text", category: "text" });

export const Equipment = mongoose.model<IEquipment>(
  "Equipment",
  equipmentSchema,
);
