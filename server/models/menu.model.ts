import { Document, Schema, model } from 'mongoose'
import { ChangeDataSchema, enumMenuType } from './common.model'
export interface MenuDocument extends Models.Menu, Document { }
const MenuSchema = new Schema<MenuDocument>({
  title: { type: String, required: true },
  type: { type: String, enum: enumMenuType, required: true },
  refId: { type: String, required: false }, // category/post/product
  url: { type: String, required: false }, // if it is an external link
  pid: { type: String, default: null }, // Parent menu id
  icon: { type: String, default: null },
  sort: { type: Number, default: 1 },
  flag: { type: Number, default: 1 },
  created: { type: ChangeDataSchema },
  updated: { type: ChangeDataSchema, default: null },
})//, { timestamps: { currentTime: () => Date.now() } })

export const MenuModel = model<MenuDocument>('menu', MenuSchema)

