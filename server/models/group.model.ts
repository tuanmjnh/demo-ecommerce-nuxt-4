import { Document, Schema, model } from 'mongoose'
import { TimeEventSchema, FileAttachSchema, MetaSchema, ChangeDataSchema, SeoDataSchema } from './common.model'

export interface GroupDocument extends Models.Group, Document { }
const groupSchema = new Schema<GroupDocument>({
  key: { type: String, required: true },
  code: { type: String, required: true, unique: true, uppercase: true },
  parent: { type: String, default: null },
  title: { type: String, required: true },
  slug: { type: String, index: true }, // SEO-friendly link
  slugFull: { type: String, required: false }, // SEO + Rewrite -> example: /tin-tuc/cong-nghe
  seo: { type: SeoDataSchema },
  desc: { type: String, default: null },
  level: { type: Number, default: 1 },
  content: { type: String, default: null },
  url: { type: String, default: null },
  image: { type: FileAttachSchema, default: null },
  images: { type: [FileAttachSchema], default: null },
  quantity: { type: Number, default: null },
  position: { type: [String], default: ['left'] },
  tags: { type: [String], default: null },
  icon: { type: String, default: null },
  color: { type: String, default: null },
  time: { type: TimeEventSchema, default: null },
  sort: { type: Number, default: 1 },
  flag: { type: Number, default: 1 },
  type: { type: String, default: 'page' },
  name: { type: String, rquired: true },
  path: { type: String, default: '/' },
  redirect: { type: String, default: null },
  component: { type: String, rquired: true },
  children: { type: [Object], default: null },
  meta: { type: Object, default: null },
  created: { type: ChangeDataSchema },
  updated: { type: ChangeDataSchema, default: null },
})

export const GroupModel = model<GroupDocument>('group', groupSchema)

