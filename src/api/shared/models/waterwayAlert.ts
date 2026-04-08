import mongoose, { Document, Schema } from "mongoose";

export interface IWaterAlert extends Document {
  name: string;
  type: string;
  alertDate: Date;
  location?: string;
  googleLocation?: string;
  reportedDate?: Date;
  source?: string;
  issued?: string;
  clearanceEta?: Date;
  statusCheck?: string;
  description?: string;
  image?: string;
  urgency?: string;
  maintainBy?: string;
  advise?: string;
  impact?: string;
  forecast?: string;
  suggestion?: string;
  closed?: string;
  reason?: string;
}

const waterAlertSchema = new Schema<IWaterAlert>(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["Lock-Closure", "Weather-Warning", "Navigation-Warning"],
      required: true,
    },
    alertDate: { type: Date, required: true },
    location: String,
    googleLocation: String,
    reportedDate: Date,
    source: String,
    issued: String,
    clearanceEta: Date,
    statusCheck: String,
    description: String,
    image: String,
    urgency: String,
    maintainBy: String,
    advise: String,
    impact: String,
    forecast: String,
    reason: String,
    suggestion: String,
    closed: String,
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

export const WaterAlert = mongoose.model<IWaterAlert>(
  "WaterAlert",
  waterAlertSchema,
);
