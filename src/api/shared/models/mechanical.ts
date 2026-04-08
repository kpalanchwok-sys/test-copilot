import mongoose, { Document, Schema } from "mongoose";

interface IServiceComponent {
  lastActionDate?: Date;
  nextService?: Date;
  status?: string;
}

interface IEngine {
  engineSide: string;
  // engineSide: "Port" | "Starboard";
  model?: string;
  serialNumber?: string;

  installedOn?: Date;
  currentHours?: string;

  health?: string;

  lastServicedOn?: Date;
  nextServiceInHours?: string;

  oilStatus?: string;

  components: {
    engineOil?: IServiceComponent;
    gearboxFluid?: IServiceComponent;
    propeller?: IServiceComponent;
    shaftSeals?: IServiceComponent;
  };
}

export interface IMechanical extends Document {
  boatId: mongoose.Types.ObjectId;

  description?: string;

  upcomingService: {
    fullServiceDueAtHours?: string;
    reminderAtHours?: string;
  };

  engines: IEngine[];
}

const serviceComponentSchema = new Schema<IServiceComponent>(
  {
    lastActionDate: Date,
    nextService: Date,
    status: {
      type: String,
      // enum: ["good", "due", "overdue"],
      // default: "good",
    },
  },
  { _id: false },
);

const engineSchema = new Schema<IEngine>(
  {
    engineSide: {
      type: String,
      // enum: ["Port", "Starboard"],
      // required: true,
    },

    model: String,
    serialNumber: String,

    installedOn: Date,
    currentHours: { type: Number, default: 0 },

    health: {
      type: String,
      // enum: ["Good", "Warning", "Critical"],
      // default: "Good",
    },

    lastServicedOn: Date,
    nextServiceInHours: Number,

    oilStatus: {
      type: String,
      // enum: ["Changed", "Due", "Overdue"],
      // default: "Changed",
    },

    components: {
      engineOil: serviceComponentSchema,
      gearboxFluid: serviceComponentSchema,
      propeller: serviceComponentSchema,
      shaftSeals: serviceComponentSchema,
    },
  },
  { _id: true },
);

const mechanicalSchema = new Schema<IMechanical>(
  {
    boatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boat",
      required: true,
    },

    description: String,

    upcomingService: {
      fullServiceDueAtHours: Number,
      reminderAtHours: Number,
    },

    engines: {
      type: [engineSchema],
      default: [],
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

// Index
mechanicalSchema.index({ boatId: 1 });

export const Mechanical = mongoose.model<IMechanical>(
  "Mechanical",
  mechanicalSchema,
);
