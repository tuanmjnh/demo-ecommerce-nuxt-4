import { z } from 'zod'

// Define constants
const validMenuTypes = ['PAGE', 'CATEGORY', 'POST', 'PRODUCT', 'LINK', 'MODULE'] as const

export const MenuValidation = {
  create: z.object({
    title: z.string().min(1, 'Title is required'),
    // FIX: Cast readonly array to mutable tuple [string, ...string[]]
    // Removed { errorMap } to fix overload error. Zod provides default enum error messages.
    type: z.enum(validMenuTypes),
    refId: z.string().optional(),
    url: z.string().optional(),
    pid: z.string().nullable().optional(),
    icon: z.string().optional(),
    sort: z.number().default(1),
    flag: z.number().default(1),
  }),

  update: z.object({
    title: z.string().min(1).optional(),
    // FIX: Cast readonly array here too
    type: z.enum(validMenuTypes).optional(),
    refId: z.string().optional(),
    url: z.string().optional(),
    pid: z.string().nullable().optional(),
    icon: z.string().optional(),
    sort: z.number().optional(),
    flag: z.number().optional(),
  }).partial(),

  // Schema for bulk update positions (drag & drop)
  updatePositions: z.array(z.object({
    id: z.string(),
    pid: z.string().nullable(),
    sort: z.number()
  }))
}
