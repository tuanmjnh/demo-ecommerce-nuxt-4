import { Document, Schema, model } from 'mongoose'
import { ChangeDataSchema } from './common.model'
export interface RoleDocument extends Models.Role, Document { }
const roleSchema = new Schema<RoleDocument>({
  key: { type: String, required: true },
  code: { type: String, required: true, unique: true, uppercase: true },
  title: { type: String, required: true },
  level: { type: Number, default: 1 },
  desc: { type: String, default: null },
  color: { type: String, default: null },
  icon: { type: String, default: 'icon-park-outline:protect' },
  routes: { type: [String], default: [] },
  sort: { type: Number, default: 1 },
  flag: { type: Number, default: 1 },
  created: { type: ChangeDataSchema },
  updated: { type: ChangeDataSchema, default: null },
})

export const RoleModel = model<RoleDocument>('role', roleSchema)

