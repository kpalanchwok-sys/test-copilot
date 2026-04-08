import mongoose, { Document, Schema } from "mongoose";

export interface IBoatMaintenanceRecord extends Document {
  boatId: mongoose.Types.ObjectId;
  image?: string;

  liftedDate?: Date;
  location?: string;
  liftServicePartner?: string;

  antifoulingDate?: Date;
  paintType?: string;
  antifoulingServicePartner?: string;

  returnDate?: Date;
  condition?: string;
  returnServicePartner?: string;

  createdBy?: mongoose.Types.ObjectId;
}

const boatMaintenanceSchema = new Schema<IBoatMaintenanceRecord>(
  {
    boatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boat",
      required: true,
    },
    image: String,

    liftedDate: Date,
    location: String,
    liftServicePartner: String,

    antifoulingDate: Date,
    paintType: String,
    antifoulingServicePartner: String,

    returnDate: Date,
    condition: String,
    returnServicePartner: String,

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

const BoatMaintenanceRecord = mongoose.model<IBoatMaintenanceRecord>(
  "BoatMaintenanceRecord",
  boatMaintenanceSchema,
);
export default BoatMaintenanceRecord;
