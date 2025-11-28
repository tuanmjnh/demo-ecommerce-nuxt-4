import { Document, Schema, model } from 'mongoose'
import { ChangeDataSchema, enumMenuType, enumMenuTarget, enumMenuLocation, FileAttachSchema } from './common.model'
export interface MenuDocument extends Models.Menu, Document { }
const MenuSchema = new Schema<MenuDocument>({
  title: { type: String, required: true },
  desc: { type: String, default: null },
  locations: { type: [String], enum: enumMenuLocation, default: ['HEADER_MAIN'] },
  pid: { type: String, default: null }, // Parent menu id
  level: { type: Number, default: 0 }, // Parent menu id
  sort: { type: Number, default: 1 },
  type: { type: String, enum: enumMenuType, required: true },
  refId: { type: String, required: false }, // category/post/product
  url: { type: String, required: false }, // if it is an external link
  path: { type: String, required: false },
  target: { type: String, enum: enumMenuTarget, default: '_self' },
  rel: { type: String, required: false },
  icon: { type: String, default: null },
  image: { type: FileAttachSchema, default: null },
  cssClass: { type: String, default: null },
  flag: { type: Number, default: 1 },
  history: { type: ChangeDataSchema, default: null },
  createdAt: { type: Number },
  updatedAt: { type: Number },
}, { timestamps: { currentTime: () => Date.now() } })

export const MenuModel = model<MenuDocument>('menu', MenuSchema)

