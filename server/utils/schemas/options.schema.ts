import { z } from 'zod'

export const OptionsValidation = {
  // Schema for creating options
  create: z.object({
    // Auto lowercase key
    key: z.string().min(1, 'Key is required').transform(val => val.toLowerCase()),
    // Auto uppercase code
    code: z.string().min(1, 'Code is required').transform(val => val.toUpperCase()),
    title: z.string().min(1, 'Title is required'),
    desc: z.string().optional(),
    meta: z.array(z.any()).optional(), // Or define strict Meta schema
    sort: z.number().default(1),
    flag: z.number().default(1),
  }),

  // Schema for updating
  update: z.object({
    key: z.string().min(1).transform(val => val.toLowerCase()).optional(),
    code: z.string().min(1).transform(val => val.toUpperCase()).optional(),
    title: z.string().min(1).optional(),
    desc: z.string().optional(),
    meta: z.array(z.any()).optional(),
    sort: z.number().optional(),
    flag: z.number().optional(),
  }).partial()
}
