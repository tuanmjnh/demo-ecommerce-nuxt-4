import { Document, Schema, model } from 'mongoose'
import { ChangeDataSchema } from './common.model'

export interface StockTransactionDocument extends Models.StockTransaction, Document { }

export const StockTransactionSchema: Schema = new Schema<StockTransactionDocument>({
  stockId: { type: Schema.Types.ObjectId, ref: 'stocks', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'products', required: true },
  warehouseId: { type: Schema.Types.ObjectId, ref: 'warehouses', required: true },

  // Type of transaction
  type: { type: String, enum: ['import', 'export', 'adjust'], required: true },

  quantity: { type: Number, required: true }, // Number of items changed
  price: { type: Number, default: 0 }, // Unit price at transaction time
  total: { type: Number, default: 0 }, // Total value

  note: { type: String, default: null },

  created: { type: ChangeDataSchema },
  updated: { type: ChangeDataSchema, default: null },
}, {
  timestamps: {
    currentTime: () => Date.now(),
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  }
})

export const ModelStockTransaction = model<StockTransactionDocument>('stock_transactions', StockTransactionSchema)

StockTransactionSchema.index({ productId: 1, warehouseId: 1, type: 1 })
