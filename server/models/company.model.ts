import { Document, Schema, model } from 'mongoose'
import { ChangeDataSchema, socialSchema, SeoDataSchema, FileAttachSchema } from './common.model'
export interface CompanyDocument extends Models.Company, Document { }
const CompanySchema = new Schema<CompanyDocument>({
  name: { type: String, required: true },
  shortName: { type: String, default: null },
  address: { type: String, default: null },
  phone: { type: String, default: null },
  fax: { type: String, default: null },
  email: { type: String, default: null },
  hotline: { type: String, default: null },
  taxCode: { type: String, default: null },
  logo: { type: FileAttachSchema, default: null },
  banner: { type: FileAttachSchema, default: null },
  images: { type: [FileAttachSchema], default: null },
  mapEmbed: { type: String, default: null },
  social: { type: socialSchema },
  openingHours: { type: String, default: null },
  seo: { type: SeoDataSchema, default: null },
  created: { type: ChangeDataSchema },
  updated: { type: ChangeDataSchema, default: null },
})

export const CompanyModel = model<CompanyDocument>('company', CompanySchema)

