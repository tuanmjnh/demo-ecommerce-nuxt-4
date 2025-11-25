import { z } from 'zod'

// Define enums directly or use readonly arrays without destructive casting for Zod
export const PostInteractionValidation = {
  create: z.object({
    postId: z.string().min(1, 'PostId is required'),
    postSlug: z.string().optional(),
    userId: z.string().optional(),
    sessionId: z.string().optional(),
    ip: z.string().optional(),
    userAgent: z.string().optional(),
    // Use explicit literals to ensure TS infers "view" | "like" ... instead of string
    type: z.enum(['view', 'like', 'share', 'comment', 'rate']),
    action: z.enum(['add', 'remove']).optional(),
    comment: z.string().optional(),
    rating: z.number().min(1).max(5).optional(),
    flag: z.number().default(1),
    status: z.enum(['active', 'pending', 'hidden', 'spam']).default('active'),
  }),

  // Schema for specific actions
  view: z.object({
    PostId: z.string().min(1),
    PostSlug: z.string().optional(),
    ip: z.string().optional(),
    userAgent: z.string().optional(),
    sessionId: z.string().optional(),
  }),

  like: z.object({
    PostId: z.string().min(1),
    userId: z.string().min(1),
    action: z.enum(['add', 'remove']),
  }),

  share: z.object({
    PostId: z.string().min(1),
    userId: z.string().optional(),
  }),

  comment: z.object({
    PostId: z.string().min(1),
    userId: z.string().min(1),
    comment: z.string().min(1),
  }),

  rate: z.object({
    PostId: z.string().min(1),
    userId: z.string().min(1),
    rating: z.number().min(1).max(5),
  })
}
