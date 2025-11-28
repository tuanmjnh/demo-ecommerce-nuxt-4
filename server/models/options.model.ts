import { Document, Schema, model } from 'mongoose'
import { MetaSchema, ChangeDataSchema } from './common.model'
export interface OptionsDocument extends Models.Options, Document { }
const OptionsSchema = new Schema<OptionsDocument>({
  key: { type: String, required: true, lowercase: true },
  code: { type: String, required: true, index: true, uppercase: true },
  value: { type: String, default: null },
  title: { type: String, required: true },
  desc: { type: String, default: null },
  meta: { type: [MetaSchema], default: null },
  sort: { type: Number, default: 1 },
  flag: { type: Number, default: 1 },
  created: { type: ChangeDataSchema },
  updated: { type: ChangeDataSchema, default: null }
})

export const OptionsModel = model<OptionsDocument>('options', OptionsSchema)
OptionsSchema.index({ key: 1, code: 1 }, { unique: true })
