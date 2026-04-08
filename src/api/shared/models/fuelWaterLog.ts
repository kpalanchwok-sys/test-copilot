import mongoose, { Document, Schema } from "mongoose";

interface IMedia {
  fileName: string;
  fileUrl: string;
  contentType: string;
  fileSize: number;
  status: string;
}

export interface IFuelLog extends Document {
  boatId: mongoose.Types.ObjectId;

  date: Date;
  type: string;

  litres: number;
  currentLevel?: number;

  lastFilled?: Date;
  lastService?: Date;

  pricePerLitre?: number;
  amount?: number;

  fuelSupplier?: string;
  location?: string;
  paymentMethod?: string;

  tank?: string;
  capacity?: number;

  levelBefore?: number;
  levelAfter?: number;

  engineHours?: number;
  weather?: string;
  gpsLocation?: string;

  nextServiceDate?: Date;

  notes?: string;

  images: IMedia[];
  videos: IMedia[];
  documents: IMedia[];
}

const mediaSchema = new Schema<IMedia>({
  fileName: String,
  fileUrl: String,
  contentType: String,
  fileSize: Number,
  status: { type: String },
});

const fuelLogSchema = new Schema<IFuelLog>(
  {
    boatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boat",
      required: true,
      index: true,
    },

    date: { type: Date, required: true },

    type: {
      type: String,
      // enum: ["fill", "consumption", "transfer"],
      required: true,
    },

    litres: { type: Number, required: true, min: 0 },

    currentLevel: Number,

    lastFilled: Date,
    lastService: Date,

    pricePerLitre: Number,
    amount: Number,

    fuelSupplier: String,
    location: String,
    paymentMethod: {
      type: String,
      // enum: ["cash", "card", "online"],
    },

    tank: String,
    capacity: Number,

    levelBefore: Number,
    levelAfter: Number,

    engineHours: Number,
    weather: String,
    gpsLocation: String,

    nextServiceDate: Date,

    notes: String,

    images: [mediaSchema],
    videos: [mediaSchema],
    documents: [mediaSchema],
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

fuelLogSchema.index({ boatId: 1, date: -1 });

const FuelLog = mongoose.model<IFuelLog>("FuelLog", fuelLogSchema);
export default FuelLog;
