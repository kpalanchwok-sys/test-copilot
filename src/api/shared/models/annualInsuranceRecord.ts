import mongoose, { Document, Schema } from "mongoose";

export interface IAnnualInsuranceRecord extends Document {
  boatId: mongoose.Types.ObjectId;
  image?: string;
  insurer: string;
  policyNumber: string;
  policyType: string;
  status: string;
  autoRenewal: boolean;
  startDate: Date;
  endDate: Date;
  dueDate: Date;
  premiumAmount: number;
  paymentDate?: Date;
  paymentMethod?: string;
  billingFrequency?: string;
  taxIncluded: boolean;
  receipt?: string;
  documents: string[];
  reminderDate?: Date;
  createdBy?: mongoose.Types.ObjectId;
}

const annualInsuranceSchema = new Schema<IAnnualInsuranceRecord>(
  {
    boatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boat",
      required: true,
    },
    image: String,
    insurer: { type: String, required: true },
    policyNumber: { type: String, required: true, unique: true },
    policyType: String,
    status: {
      type: String,
      // enum: ["active", "expired", "pending"],
      // default: "active",
    },
    autoRenewal: { type: Boolean, default: false },
    startDate: Date,
    endDate: Date,
    dueDate: Date,
    premiumAmount: Number,
    paymentDate: Date,
    paymentMethod: String,
    billingFrequency: String,
    taxIncluded: { type: Boolean, default: false },
    receipt: String,
    documents: [String],
    reminderDate: Date,
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

const AnnualInsuranceRecord = mongoose.model<IAnnualInsuranceRecord>(
  "AnnualInsuranceRecord",
  annualInsuranceSchema,
);

export default AnnualInsuranceRecord;
