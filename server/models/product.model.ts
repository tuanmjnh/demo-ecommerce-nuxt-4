import { Document, Schema, model } from 'mongoose'
import { FileAttachSchema, MetaSchema, ChangeDataSchema } from './common.model'
import { VariantSchema } from './variant.model'
import { StockSchema } from './stock.model'

// export const schemaIVariantOption = new Schema<Models.IVariantOption>({
//   id: { type: String, unique: true },
//   label: { type: String, required: true },
//   image: { type: Object, default: null }
// })
// export const schemaIVariant = new Schema<Models.IVariant>({
//   id: { type: String, unique: true },
//   name: { type: String, required: true },
//   options: { type: [schemaIVariantOption], default: [] },
//   showImage: { type: Boolean, default: false },
//   order: { type: Number, default: 1 }
// })
export interface ProductDocument extends Models.Product, Document { }

export const ProductSchema: Schema = new Schema<ProductDocument>({
  code: { type: String, unique: true, required: true, uppercase: true },
  groups: { type: [String], default: [] },
  title: { type: String, required: true },
  slug: { type: String, index: true },
  desc: { type: String, required: false },
  content: { type: String, required: false },
  variants: { type: [VariantSchema], default: [] },
  stocks: { type: [StockSchema], default: [] },
  priceSelling: { type: Number, required: false },
  pricePromotional: { type: Number, required: false },
  quantity: { type: Number, required: false },
  unit: { type: String, required: false },
  brand: { type: String, required: false },
  originName: { type: String, required: false },
  originAddress: { type: String, required: false },
  weight: { type: Number, required: false },
  warranty: { type: String, required: false },
  image: { type: FileAttachSchema, default: null },
  images: { type: [FileAttachSchema], default: [] },
  tags: { type: [String], default: null },
  attributes: { type: [MetaSchema], default: null },
  meta: { type: [MetaSchema], default: null },
  pins: { type: [String], default: null },
  sort: { type: Number, default: 1 },
  flag: { type: Number, default: 1 },
  created: { type: ChangeDataSchema },
  updated: { type: ChangeDataSchema, default: null },
})

// ProductSchema.pre('save', function (next) {
//   this.updated = { ...this.updated, date: Date.now() }
//   next()
// })

export const ProductModel = model<ProductDocument>('products', ProductSchema)
ProductSchema.index({ code: 'text', title: 'text', brand: 'text', qrcode: 'text', barcode: 'text' })
