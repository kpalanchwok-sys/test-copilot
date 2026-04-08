import mongoose, { Document, Schema } from "mongoose";

interface IAddress {
  lineOne: string;
  lineTwo?: string;
  lineThree?: string;
  city: string;
  postCode?: string;
  county?: string;
  country?: string;
}

export interface IUserManagement extends Document {
  groups: string[];
  email: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  dateOfBirth: Date;
  organisationId: mongoose.Types.ObjectId;
  status: "Active" | "Inactive";
  address: IAddress;
  governingBody?: string;
}

const addressSchema = new Schema<IAddress>(
  {
    lineOne: { type: String, required: true },
    lineTwo: String,
    lineThree: String,
    city: { type: String, required: true },
    postCode: String,
    county: String,
    country: String,
  },
  { _id: false },
);

const userManagementSchema = new Schema<IUserManagement>(
  {
    groups: { type: [String], default: [] },
    email: { type: String, required: true, unique: true, trim: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    contactNumber: { type: String },
    dateOfBirth: { type: Date },
    organisationId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Organisation",
    },
    status: { type: String, enum: ["Active", "Inactive"], default: "Inactive" },
    address: { type: addressSchema, required: true },
    governingBody: String,
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

const UserManagement = mongoose.model<IUserManagement>(
  "UserManagement",
  userManagementSchema,
);
export default UserManagement;
