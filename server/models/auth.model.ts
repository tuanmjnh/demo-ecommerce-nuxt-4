import mongoose, { Schema, Document, Model } from 'mongoose'
import { enumDevice } from './common.model'
// import '#types/IAuth'
// Interface for mongoose document
export interface AuthDocument extends Models.Auth, Document { }

const AuthSchema = new Schema<AuthDocument>({
  userId: { type: String, required: true, index: true }, // index for fast query
  deviceId: { type: String, required: true },
  deviceType: { type: String, required: true, enum: enumDevice },
  deviceName: { type: String },
  // accessToken: { type: String, required: true },
  refreshToken: { type: String, default: null },
  refreshExpireAt: { type: Number, default: null },               // timestamp
  ip: { type: String, default: null },
  userAgent: { type: String },
  flag: { type: Number, default: 1 }, // 1 = active, 0 = locked
  createdAt: { type: Number },
  updatedAt: { type: Number },
}, { timestamps: { currentTime: () => Date.now() } })

export const AuthModel: Model<AuthDocument> = mongoose.models.Auth || mongoose.model<AuthDocument>('auth', AuthSchema)
// Ensure each userId + deviceId pair is unique
AuthSchema.index({ userId: 1, deviceId: 1 }, { unique: true })
