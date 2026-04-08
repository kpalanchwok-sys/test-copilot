import mongoose, { Document, Schema } from "mongoose";

export interface IContactInquiry extends Document {
  name: string;
  email: string;
  mobileNumber: string;
  message: string;
  preferredContactMethod?: string;

  status?: string;
  createdBy?: mongoose.Types.ObjectId;
}

const contactInquirySchema = new Schema<IContactInquiry>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },

    mobileNumber: {
      type: String,
      required: true,
      match: [/^\d{7,15}$/, "Invalid mobile number"],
    },

    message: {
      type: String,
      required: true,
    },

    preferredContactMethod: {
      type: String,
      enum: ["email", "phone", "whatsapp"],
      default: "email",
    },

    status: {
      type: String,
      enum: ["new", "in_progress", "resolved"],
      default: "new",
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

// Index for search
contactInquirySchema.index({ name: "text", email: "text" });

export const ContactInquiry = mongoose.model<IContactInquiry>(
  "ContactInquiry",
  contactInquirySchema,
);
