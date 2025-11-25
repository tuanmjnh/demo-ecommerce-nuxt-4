import { Document, Schema, model } from 'mongoose'
import { ChangeDataSchema } from './common.model'

export interface WarehouseDocument extends Models.Warehouse, Document { }
export const WarehouseSchema: Schema = new Schema<WarehouseDocument>({
  title: { type: String, required: true },
  code: { type: String, unique: true, uppercase: true, index: true },
  address: { type: String, default: null },
  contactName: { type: String, default: null },
  contactPhone: { type: String, default: null },
  description: { type: String, default: null },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  created: { type: ChangeDataSchema },
  updated: { type: ChangeDataSchema, default: null },
})

export const WarehouseModel = model<WarehouseDocument>('warehouses', WarehouseSchema)
WarehouseSchema.index({ name: 'text', code: 'text', address: 'text' })
