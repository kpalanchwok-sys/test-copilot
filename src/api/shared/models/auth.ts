import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose, { Document, Schema, Types } from "mongoose";
import config from "../../config";

interface IAddress {
  lineOne: string;
  lineTwo?: string;
  lineThree?: string;
  city?: string;
  postCode?: string;
  county?: string;
  country?: string;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  governingBody: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  avatar?: string;
  coverImg?: string;
  dateOfBirth?: Date;
  email: string;
  password: string;
  groups?: string[];
  contactNumber?: string;
  address?: IAddress;
  otp?: number | null;
  otpExpiry?: Date | null;
  isVerified?: Boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  refreshToken?: string;
  generateRefreshToken: () => string;
  generateAccessToken: (interval?: number) => string;
  comparePassword(password: string): Promise<boolean>;
}

const addressSchema = new Schema<IAddress>(
  {
    lineOne: String,
    lineTwo: String,
    lineThree: String,
    city: String,
    postCode: String,
    county: String,
    country: String,
  },
  { _id: false },
);

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    avatar: { type: String },
    coverImg: { type: String },

    dateOfBirth: Date,

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    groups: {
      type: [String],
      enum: [
        "Members",
        "organization",
        "internal",
        "governing-body",
        "local-governments",
        "lock-keepers",
        "commercial-partners",
        "service-providers",
        "non-boat",
      ],
      default: ["Members"],
    },

    contactNumber: String,
    governingBody: {
      type: String,
      default: "NHSPFS",
    },

    address: addressSchema,
    otp: { type: Number, default: null },
    otpExpiry: { type: Date, default: null },
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    refreshToken: {
      type: String,
      select: false,
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

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

//  Hash password before save
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.generateAccessToken = function (interval?: number) {
  // return jwt.sign({ _id: this._id, role: "user" }, config.JWT_SECRET_KEY, {
  return jwt.sign(
    { _id: this._id, group: this.groups[0] },
    config.JWT_SECRET_KEY,
    {
      expiresIn: interval || config.JWT_EXPIRES_IN || "1d",
    },
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, config.JWT_SECRET_KEY, {
    expiresIn: config.JWT_REFRESH_EXPIRES_IN || "7d",
  });
};

//  Compare password
userSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);
