import { Document, Schema, model } from 'mongoose'
import { FileAttachSchema, ChangeDataSchema } from './common.model'

export interface VariantDocument extends Models.Variant, Document { }
export const VariantOptionSchema = new Schema<Models.IVariantOption>({
  // id: { type: String, required: true },
  label: { type: String, required: true },
  value: { type: String, required: true },
  image: { type: FileAttachSchema, default: null }
}, { _id: false })

export const VariantSchema = new Schema<VariantDocument>({
  name: { type: String, required: true },
  options: { type: [VariantOptionSchema], default: [] },
  showImage: { type: Boolean, default: false },
  order: { type: Number, default: 1 },
  desc: { type: String, default: null },
  created: { type: ChangeDataSchema },
  updated: { type: ChangeDataSchema, default: null },
})

export const ModelVariant = model<VariantDocument>('variants', VariantSchema)
VariantSchema.index({ name: 'text' })
