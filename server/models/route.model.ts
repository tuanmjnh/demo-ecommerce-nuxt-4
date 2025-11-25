import { Document, Schema, model } from 'mongoose'
import { ChangeDataSchema, enumRouteType } from './common.model'
export type RouteDocument = Models.RouteMeta & Models.RouteMetaExtra & Document
const RouteSchema = new Schema<RouteDocument>({
  id: { type: Number, default: null },
  pid: { type: Number, default: null },
  name: { type: String, required: true, unique: true, lowercase: true },
  path: { type: String, required: true },
  component: { type: String, default: null },
  title: { type: String, required: true },
  group: { type: String, default: null },
  icon: { type: String, default: null },
  require: { type: Boolean, default: true },
  access: { type: Boolean, default: false },
  keep: { type: Boolean, default: false },
  hide: { type: Boolean, default: false },
  redirect: { type: String, default: null },
  href: { type: String, default: null },
  active: { type: String, default: null },
  tab: { type: Boolean, default: true },
  pin: { type: Boolean, default: false },
  type: { type: enumRouteType, default: 'page' },
  sort: { type: Number, default: 1 },
  flag: { type: Number, default: 1 },
  created: { type: ChangeDataSchema },
  updated: { type: ChangeDataSchema, default: null },
})

export const RouteModel = model<RouteDocument>('route', RouteSchema)

