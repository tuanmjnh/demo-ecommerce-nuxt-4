import { z } from 'zod'

export const WarehouseValidation = {
  create: z.object({
    title: z.string().min(1, 'Title is required'),
    code: z.string().min(1, 'Code is required').transform(val => val.toUpperCase()),
    address: z.string().optional(),
    contactName: z.string().optional(),
    contactPhone: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(['active', 'inactive']).default('active'),
    flag: z.number().default(1),
  }),

  update: z.object({
    title: z.string().min(1).optional(),
    code: z.string().min(1).transform(val => val.toUpperCase()).optional(),
    address: z.string().optional(),
    contactName: z.string().optional(),
    contactPhone: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional(),
    flag: z.number().optional(),
  }).partial()
}
