import mongoose from 'mongoose'
import { TimeEventSchema, FileAttachSchema, MetaSchema, SeoDataSchema, PostStatsSchema, ChangeDataSchema, PostMediaSchema, enumStatus, enumPostType, enumPostFormat } from './common.model'

export interface PostDocument extends Models.Post, mongoose.Document { }
const PostSchema = new mongoose.Schema<PostDocument>({
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

// 1. Cho trang chủ/danh sách mặc định (Lọc theo flag + Sort mới nhất)
// Query: { flag: 1 } -> Sort: { createdAt: -1 }
PostSchema.index({ flag: 1, createdAt: -1 })

// 2. Cho trang danh mục/nhóm (Lọc flag + groups + Sort mới nhất)
// Query: { flag: 1, groups: { $in: [...] } } -> Sort: { createdAt: -1 }
// Index cũ của bạn thiếu 'flag' ở đầu nên chưa tối ưu
PostSchema.index({ flag: 1, groups: 1, createdAt: -1 })

// 3. Cho việc lọc theo Key (VD: Lấy tin tức, thông báo...)
// Query: { flag: 1, key: 'news' } -> Sort: { createdAt: -1 }
PostSchema.index({ flag: 1, key: 1, createdAt: -1 })

// 4. Cho việc lọc bài ghim (Pins)
// Query: { flag: 1, pins: { $in: [...] } } -> Sort: { createdAt: -1 }
PostSchema.index({ flag: 1, pins: 1, createdAt: -1 })

// 5. Text Search (Optional - Nếu bạn dùng $text search sau này)
// Lưu ý: Regex search { title: /.../ } KHÔNG dùng index này, nó dùng Scan Collection.
// PostSchema.index({ title: 'text', desc: 'text' })

// export const PostModel = model<PostDocument>('post', PostSchema)
export const PostModel = mongoose.models.post || mongoose.model<PostDocument>('post', PostSchema)