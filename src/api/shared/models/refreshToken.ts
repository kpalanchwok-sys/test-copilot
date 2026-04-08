import mongoose, { Document, Schema } from 'mongoose';

interface IToken {
  deviceId: string;
  device?: string;
  token: string;
  userAgent?: string;
  ipAddress?: string;
  expiresAt: Date;
  pushNotificationDeviceId?: string;
}

export interface IRefreshToken extends Document {
  userId: string;
  tokens: IToken[];
}

const tokenSchema = new Schema<IToken>(
  {
    deviceId: {
      type: String,
      required: true
    },

    pushNotificationDeviceId: {
      type: String
    },

    token: {
      type: String
    },
    userAgent: {
      type: String
    },

    device: { type: String },

    ipAddress: {
      type: String
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  { _id: false } 
);

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    userId: {
      type: String,
      required: true
    },
    tokens: [tokenSchema]
  },
  { timestamps: true }
);

// Index for efficient querying by userId and tokens.deviceId
refreshTokenSchema.index({ userId: 1, 'tokens.deviceId': 1 });

const RefreshToken = mongoose.model<IRefreshToken>('RefreshToken', refreshTokenSchema);
export default RefreshToken;
