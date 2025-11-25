import { z } from 'zod'

// 1. Define Enum/Constant as in previous lesson
const validStatus = ['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED', 'PRIVATE', 'TRASH', 'FUTURE'] as const
const validLanguage = ['vi', 'en', 'zh', 'ja', 'ko'] as const

// 2. Define Sub-Schemas (Imitate Common namespace)
// You can replace z.any() with z.object({...}) if you want to be stricter

// Common.IFileAttach
const FileSchema = z.object({
  url: z.string(),
  name: z.string().optional(),
  type: z.string().optional(),
  size: z.number().optional()
}).passthrough() // Allow other fields if yes

// Common.IMeta, ISeoData, etc.

const MetaSchema = z.any()
const SeoSchema = z.any()
const TimeEventSchema = z.any()

// 3. Main Post Schema
export const PostValidation = {
  create: z.object({
    /** Identifier & grouping */
    key: z.string().min(1, 'Key is required'), // Required
    code: z.string().min(1, 'Code is required').transform(val => val.toUpperCase()), // Auto uppercase
    groups: z.array(z.string()).default([]), // Default empty array if not passed

    // Slug & SlugFull: Usually backend will generate automatically if missing, so leave optional
    slug: z.string().optional(),
    slugFull: z.string().nullish(),

    title: z.string().min(1, 'Title is required'),
    desc: z.string().nullish(),
    content: z.string().optional(),
    BottomContent: z.string().nullish(),
    relatedLinks: z.array(z.string()).nullish(),

    /** Images & attachments - Use .nullish() to accept null/undefined */
    image: FileSchema.nullish(),
    images: z.array(FileSchema).nullish(),
    attaches: z.array(FileSchema).nullish(),

    /** Author & manager */
    author: z.string().nullish(),
    authorId: z.string().nullish(),
    editorId: z.string().nullish(),

    /** Time */
    date: z.number().nullish(), // Timestamp
    publishedAt: z.number().nullish(),
    expiredAt: z.number().nullish(),
    time: TimeEventSchema.nullish(),

    /** Meta & SEO */
    attributes: z.array(MetaSchema).nullish(),
    meta: z.array(MetaSchema).nullish(),
    seo: SeoSchema.nullish(),

    /** Classification & tagging */
    pins: z.array(z.string()).nullish(),
    tags: z.array(z.string()).nullish(),
    lang: z.string().default('vi'), // Default Vietnamese
    translations: z.array(z.string()).nullish(),

    /** Visibility & status */
    sort: z.number().default(1),
    flag: z.number().default(1),
    status: z.enum(validStatus).default('DRAFT'),
    isHighlight: z.boolean().default(false),

    /** * Interaction Statistics & Change History
    * Usually the Client does not send this when creating a new one (the Server init itself),
    * Should be optional in Zod even though Interface is required.
    */
    stats: z.any().optional(),
    created: z.any().optional(),
    updated: z.any().optional(),
  }),

  // Update Schema: Inherits from Create but all are optional
  update: z.object({
    key: z.string().min(1),
    code: z.string().transform(val => val.toUpperCase()),
    groups: z.array(z.string()),
    slug: z.string(),
    slugFull: z.string().nullable(),
    title: z.string().min(1),
    desc: z.string().nullable(),
    content: z.string(),
    bottomContent: z.string().nullable(),
    relatedLinks: z.array(z.string()).nullable(),

    image: FileSchema.nullable(), // Allows sending null to delete images
    images: z.array(FileSchema).nullable(),
    attaches: z.array(FileSchema).nullable(),

    author: z.string().nullable(),
    authorId: z.string().nullable(),
    editorId: z.string().nullable(),

    date: z.number().nullable(),
    publishedAt: z.number().nullable(),
    expiredAt: z.number().nullable(),
    time: TimeEventSchema.nullable(),

    attributes: z.array(MetaSchema).nullable(),
    meta: z.array(MetaSchema).nullable(),
    seo: SeoSchema.nullable(),

    pins: z.array(z.string()).nullable(),
    tags: z.array(z.string()).nullable(),
    lang: z.string().nullable(),
    translations: z.array(z.string()).nullable(),

    sort: z.number(),
    flag: z.number(),
    status: z.enum(validStatus),
    isHighlight: z.boolean(),

    // Stats are usually not updated via this API (use separate like/view API)
    //stats: z.any(),
    updated: z.any(),
  }).partial(), // .partial() makes all fields optional

  // Other auxiliary validations (remain the same)
  changeStatus: z.object({
    id: z.string().min(1),
    status: z.enum(validStatus)
  }),

  itemSearch: z.object({
    text: z.string().optional(),
    groups: z.array(z.string()).optional(),
    lang: z.string().optional(),
    status: z.enum(validStatus).optional(),
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10)
  })
}
