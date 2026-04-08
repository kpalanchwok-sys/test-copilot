import mongoose, { Document, Schema } from "mongoose";

interface IMedia {
  fileName: string;
  fileUrl: string;
  contentType: string;
  fileSize: number;
  status: string;
}

export interface IBoatTrip extends Document {
  boatId: mongoose.Types.ObjectId;

  startType?: string;
  tripName?: string;

  startDate: Date;
  endDate?: Date;

  baseBerth?: string;
  autoEnd: boolean;

  note?: string;

  crewEmails: string[];
  waypoints: string[];

  images: IMedia[];
  videos: IMedia[];

  youTubeUrl: string[];

  status: string;
}

const mediaSchema = new Schema<IMedia>({
  fileName: String,
  fileUrl: String,
  contentType: String,
  fileSize: Number,
  status: String,
});

const boatTripSchema = new Schema<IBoatTrip>(
  {
    boatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boat",
      required: true,
      index: true,
    },

    startType: String,
    tripName: String,

    startDate: {
      type: Date,
      required: true,
    },

    endDate: Date,

    baseBerth: String,

    autoEnd: {
      type: Boolean,
      default: false,
    },

    note: String,

    crewEmails: {
      type: [String],
      default: [],
    },

    waypoints: {
      type: [String],
      default: [],
    },

    images: {
      type: [mediaSchema],
      default: [],
    },

    videos: {
      type: [mediaSchema],
      default: [],
    },

    youTubeUrl: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
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

// Index for performance
boatTripSchema.index({ boatId: 1, startDate: -1 });

const BoatTrip = mongoose.model<IBoatTrip>("BoatTrip", boatTripSchema);
export default BoatTrip;
