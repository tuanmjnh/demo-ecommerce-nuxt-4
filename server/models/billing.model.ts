import { Document, Schema, model } from 'mongoose'
import { enumBillingStatus, ChangeDataSchema } from './common.model'

export const OrderItemSchema = new Schema<Models.OrderItem, Document>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
}, { _id: false })

export const HistoryOrderItemSchema = new Schema<Models.HistoryOrderItem, Document>({
  action: { type: String, enum: ['add', 'update', 'remove', 'cancelled'], required: true },
  items: { type: [OrderItemSchema], default: null },
  reason: { type: String, default: null },
  updated: { type: ChangeDataSchema, default: null },
}, { _id: false })

export interface BillingDocument extends Models.Billing, Document { }
const BillingSchema = new Schema<BillingDocument>({
  key: { type: String, required: true },
  code: { type: String, required: true, unique: true, uppercase: true },
  groupId: { type: String, required: true },
  items: { type: [OrderItemSchema], required: true },
  customer: { type: String, default: null },
  note: { type: String, default: null },
  total: { type: Number, required: true },
  status: { type: String, enum: enumBillingStatus, default: 'serving' },
  flag: { type: Number, default: 1 },
  history: { type: [HistoryOrderItemSchema], default: [] },
  created: { type: ChangeDataSchema },
  updated: { type: ChangeDataSchema, default: null },
})

export const BillingModel = model<BillingDocument>('Billing', BillingSchema)

