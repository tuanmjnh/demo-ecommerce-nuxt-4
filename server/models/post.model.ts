import { Document, Schema, model } from 'mongoose'
import { TimeEventSchema, FileAttachSchema, MetaSchema, SeoDataSchema, PostStatsSchema, ChangeDataSchema, PostMediaSchema, enumStatus, enumPostType, enumPostFormat } from './common.model'

export interface PostDocument extends Models.Post, Document { }
const PostSchema = new Schema<PostDocument>({
  /** Identification and grouping */
  key: { type: String, required: true },
  code: { type: String, required: true, unique: true, uppercase: true, index: true },
  type: { type: String, enum: enumPostType, default: 'post' }, // IMPORTANT: Post type (Post, Page, Product...)
  format: { type: String, enum: enumPostFormat, default: 'standard' }, // IMPORTANT: Display type (Gallery, Video...)
  slug: { type: String, required: true, index: true },
  slugFull: { type: String, required: false }, // SEO + Rewrite -> example: /tin-tuc/cong-nghe/dien-thoai-iphone-17
  groups: { type: [String], default: [] },
  title: { type: String, required: true },
  desc: { type: String, required: false },
  content: { type: String, default: null },
  blocks: { type: [Object], default: [] },
  bottomContent: { type: String, default: null },
  relatedLinks: { type: String, default: [] },
  parentId: { type: String, default: null }, // ID of parent post (if any)
  ancestors: { type: [String], default: [] }, // Array of IDs of parent levels -> optimized for breadcrumb
  /** Images & attachments */
  image: { type: FileAttachSchema, default: null },
  images: { type: [FileAttachSchema], default: [] },
  attaches: { type: [FileAttachSchema], default: [] },
  media: { type: PostMediaSchema, default: null }, // For Format: 'video' or 'audio'
  /** Author & Admin */
  author: { type: String, default: null },
  authorId: { type: String, default: null },
  editorId: { type: String, default: null },
  // Related Posts (Internal Link) - Save ID for more accurate query string
  relatedIds: { type: [String], default: null },
  // External links
  externalLinks: { type: [Object], default: null },
  /** Time */
  date: { type: Number, default: null },
  publishedAt: { type: Number, default: null },
  expiredAt: { type: Number, default: null },
  time: { type: TimeEventSchema, default: null },

  /** Meta & SEO */
  attributes: { type: [MetaSchema], default: null },
  meta: { type: [MetaSchema], default: null },
  seo: { type: SeoDataSchema, default: null },

  /** Sort and tag */
  pins: { type: [String], default: [] },
  tags: { type: [String], default: [] },
  lang: { type: String, default: 'vi' },
  translations: { type: [String], default: [] },

  /** Display & status */
  sort: { type: Number, default: 1 },
  flag: { type: Number, default: 1 },
  status: { type: String, enum: enumStatus, default: 'DRAFT' },
  isHighlight: { type: Boolean, default: false },

  /** Interaction statistics */
  stats: { type: PostStatsSchema, default: null },

  /** Change history */
  // created: { type: ChangeDataSchema },
  // updated: { type: ChangeDataSchema, default: null },
  history: { type: ChangeDataSchema, default: null },
  createdAt: { type: Number },
  updatedAt: { type: Number },
}, { timestamps: { currentTime: () => Date.now() } })

export const PostModel = model<PostDocument>('post', PostSchema)
// PostSchema.index({ title: 'text', desc: 'text', content: 'text', tags: 'text' })
