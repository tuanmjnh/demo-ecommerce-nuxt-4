import { Document, Schema, model } from 'mongoose'
import { ChangeDataSchema, enumConfigType } from './common.model'
export interface ConfigDocument extends Models.Config, Document { }
const ConfigSchema = new Schema<ConfigDocument>({
  key: { type: String, required: true },
  code: { type: String, required: true, unique: true, lowercase: true },
  value: { type: String, required: true },
  type: { type: String, enum: enumConfigType, default: 'string' },
  title: { type: String, required: true },
  level: { type: Number, default: 1 },
  desc: { type: String, default: null },
  sort: { type: Number, default: 1 },
  flag: { type: Number, default: 1 },
  created: { type: ChangeDataSchema },
  updated: { type: ChangeDataSchema, default: null },
})

export const ConfigModel = model<ConfigDocument>('config', ConfigSchema)

