import { Document, Schema, model } from 'mongoose'
import { MetaSchema } from './common.model'

export interface PostInteractionDocument extends Models.PostInteraction, Document { }
const PostInteractionSchema = new Schema<PostInteractionDocument>({
  postId: { type: String, required: true, index: true },
  postSlug: { type: String, index: true },
  userId: { type: String, index: true, default: null },
  sessionId: { type: String, index: true, default: null },
  ip: { type: String, default: null },
  userAgent: { type: String, default: null },
  author: { type: String, default: null },
  type: {
    type: String,
    enum: ['view', 'like', 'share', 'comment', 'rate'],
    required: true
  },
  action: {
    type: String,
    enum: ['add', 'remove'],
    default: null
  },
  comment: { type: String, default: null },
  rating: { type: Number, default: null },
  meta: { type: [MetaSchema], default: null },
  flag: { type: Number, default: 1 },
  status: {
    type: String,
    enum: ['active', 'pending', 'hidden', 'spam'],
    default: 'active'
  }
}, {
  timestamps: {
    currentTime: () => Date.now(),
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  }
})

export const PostInteractionModel = model<PostInteractionDocument>('post-interaction', PostInteractionSchema)

