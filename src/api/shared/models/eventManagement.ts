import mongoose, { Document, Schema } from "mongoose";

interface ICategory {
  name: string;
  description?: string;
  fee: number;
}

export interface IEvent extends Document {
  OrganizationId: mongoose.Types.ObjectId;

  name: string;
  description?: string;
  eventManager?: string;

  location: string;
  googleLocation?: string;

  categories: ICategory[];

  openingDate: Date;
  closingDate: Date;
  eventDate: Date;

  entryLimit?: number;

  image?: string;

  status: string;
  isPublic: boolean;
  deletedAt?: Date;

  createdBy?: mongoose.Types.ObjectId;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    fee: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: true }, // each category gets its own id
);

const eventSchema = new Schema<IEvent>(
  {
    OrganizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    categories: {
      type: [categorySchema],
      default: [],
    },

    description: String,
    eventManager: String,

    location: {
      type: String,
      required: true,
    },
    googleLocation: String,

    openingDate: {
      type: Date,
      required: true,
    },
    closingDate: {
      type: Date,
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },

    entryLimit: {
      type: Number,
      min: 0,
    },

    image: String,

    status: {
      type: String,
      // enum: ["draft", "active", "completed", "cancelled"],
      // default: "draft",
    },

    isPublic: {
      type: Boolean,
      default: true,
    },

    deletedAt: {
      type: Date,
      default: null,
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

// eventSchema.pre("save", function (next) {
//   if (this.openingDate > this.closingDate) {
//     return next(new Error("Opening date cannot be after closing date"));
//   }

//   if (this.eventDate < this.openingDate) {
//     return next(new Error("Event date cannot be before opening date"));
//   }

//   if (this.eventDate > this.closingDate) {
//     return next(new Error("Event date cannot be after closing date"));
//   }

//   next();
// });


// Text search
eventSchema.index({ name: "text", location: "text" });

// Query optimization
eventSchema.index({ OrganizationId: 1, eventDate: 1 });
eventSchema.index({ status: 1, eventDate: 1 });
eventSchema.index({ deletedAt: 1 });

// ##  Optional: Virtual for Event Status Auto Update

eventSchema.virtual("isOngoing").get(function () {
  const now = new Date();
  return this.openingDate <= now && this.closingDate >= now;
});

const EventManagement = mongoose.model<IEvent>("EventManagement", eventSchema);
export default EventManagement;
