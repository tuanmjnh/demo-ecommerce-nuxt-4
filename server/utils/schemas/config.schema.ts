import { z } from 'zod'

// Helper to cast enum values if needed
const configTypes = ['string', 'number', 'boolean'] as const

export const ConfigValidation = {
  create: z.object({
    key: z.string().min(1, 'Key is required'),
    // Auto lowercase code
    code: z.string().min(1, 'Code is required').transform(val => val.toLowerCase()),
    value: z.string().min(1, 'Value is required'),
    title: z.string().min(1, 'Title is required'),
    type: z.enum(configTypes).default('string'),
    level: z.number().default(1),
    desc: z.string().optional(),
    sort: z.number().default(1),
    flag: z.number().default(1),
  }),

  update: z.object({
    key: z.string().min(1).optional(),
    code: z.string().min(1).transform(val => val.toLowerCase()).optional(),
    value: z.string().min(1).optional(),
    title: z.string().min(1).optional(),
    type: z.enum(configTypes).optional(),
    level: z.number().optional(),
    desc: z.string().optional(),
    sort: z.number().optional(),
    flag: z.number().optional(),
  }).partial()
}
