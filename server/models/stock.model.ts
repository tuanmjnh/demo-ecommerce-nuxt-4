import { Document, Schema, model } from 'mongoose'
import { FileAttachSchema } from './common.model'

export interface StockDocument extends Models.Stock, Document { }

export const StockSchema: Schema = new Schema<StockDocument>({
  productId: { type: Schema.Types.ObjectId, ref: 'products', required: true },
  // Combination keys: e.g. ["RED", "XL"] matching Variant Values
  variantCombination: { type: [String], default: [] },
  sku: { type: String, required: true, unique: true }, // SKU must be unique
  price: { type: Number, required: true },
  priceImport: { type: Number, default: 0 },
  priceSale: { type: Number, default: 0 },
  quantity: { type: Number, default: 0 },
  warehouseId: { type: String, ref: 'warehouses', default: null },
  image: { type: FileAttachSchema, default: null },
  barcode: { type: String, default: null },
  qrcode: { type: String, default: null },
  // We use automatic timestamp, but keeping your field if you want manual control
  updatedAt: { type: Number, default: null },
}, {
  timestamps: {
    currentTime: () => Date.now(),
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  }
})

// Compound index to ensure unique stock entry per product + variant + warehouse
StockSchema.index({ productId: 1, warehouseId: 1, variantCombination: 1 }, { unique: true })

export const ModelStock = model<StockDocument>('stocks', StockSchema)
