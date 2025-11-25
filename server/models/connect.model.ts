import { Document, Schema, model } from 'mongoose'
import { ChangeDataSchema } from './common.model'

export interface ConnectDocument extends Models.Connect, Document { }
const ConnectSchema = new Schema<ConnectDocument>({
  key: { type: String, required: true },
  code: { type: String, required: true, unique: true, uppercase: true },
  title: { type: String, required: true },
  clientID: { type: Object, default: null },
  credentials: { type: Object, default: null },
  authUri: { type: String, default: null },
  redirectUris: { type: [String], default: null },
  profile: { type: Object, default: null },
  config: { type: Object, default: null },
  sort: { type: Number, default: 1 },
  flag: { type: Number, default: 1 },
  created: { type: ChangeDataSchema },
  updated: { type: ChangeDataSchema, default: null },
})

export const ConnectModel = model<ConnectDocument>('connect', ConnectSchema)

