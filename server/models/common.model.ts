import { Schema, Document } from 'mongoose'

export const enumLanguage = ['vi', 'en', 'zh', 'ja', 'ko']
export const enumStatus = ['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED', 'PRIVATE', 'TRASH', 'FUTURE']
export const enumDevice = ['pc', 'mobile', 'tablet', 'web']
export const enumBillingStatus = ['empty', 'serving', 'reserved', 'paid', 'cancelled']
export const enumConfigType = ['string', 'number', 'boolean']
export const enumMenuType = ['PAGE', 'CATEGORY', 'POST', 'CATEGORY-POST', 'PRODUCT', 'CATEGORY-PRODUCT', 'LINK', 'MODULE']
export const enumRouteType = ['dir', 'page']

export const LastAccessSchema = new Schema<Common.ILastAccess, Document>({
  at: { type: Number, default: Date.now },
  ip: { type: String, default: '' }
}, { _id: false })

export const ChangeDataSchema = new Schema<Common.IChangeData, Document>({
  at: { type: Number, default: Date.now },
  by: { type: String, default: 'system' },
  ip: { type: String, default: null }
}, { _id: false })

export const MetaSchema = new Schema<Common.IMeta, Document>({
  key: { type: String, default: null },
  value: { type: String, default: null },
}, { _id: false })

export const SeoDataSchema = new Schema<Common.ISeoData, Document>({
  title: { type: String, default: null },
  desc: { type: String, default: null },
  tags: { type: [String], default: null },
}, { _id: false })


export const PostStatsSchema = new Schema<Common.IPostStatsData, Document>({
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  ratingAverage: { type: Number, default: 0 },
}, { _id: false })

export const socialSchema = new Schema<Common.ISocialData, Document>({
  zalo: { type: String, default: null },
  facebook: { type: String, default: null },
  instagram: { type: String, default: null },
  youtube: { type: String, default: null },
  tiktok: { type: String, default: null },
  linkedin: { type: String, default: null },
}, { _id: false })

export const TimeEventSchema = new Schema<Common.ITimeEvent, Document>({
  start: { type: Number, default: null },
  end: { type: Number, default: null },
  label: { type: String, default: null },
}, { _id: false })

export const FileAttachSchema = new Schema<Common.IFileAttach, Document>({
  public_id: { type: String, default: null },
  display_name: { type: String, default: null },
  url: { type: String, default: null },
  format: { type: String, default: null },
  bytes: { type: Number, default: null },
  created_at: { type: Number, default: null },
}, { _id: false })
