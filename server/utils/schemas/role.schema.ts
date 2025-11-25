import { z } from 'zod'

export const RoleValidation = {
  create: z.object({
    key: z.string().min(1, 'Key is required'),
    code: z.string().min(3, 'Code must be at least 3 characters').transform(val => val.toUpperCase()),
    title: z.string().min(1, 'Title is required'),
    level: z.number().default(1),
    desc: z.string().optional(),
    color: z.string().optional(),
    icon: z.string().default('icon-park-outline:protect'),
    routes: z.array(z.string()).default([]),
    sort: z.number().default(1),
    flag: z.number().default(1),
  }),

  update: z.object({
    key: z.string().min(1).optional(),
    code: z.string().min(3).transform(val => val.toUpperCase()).optional(),
    title: z.string().min(1).optional(),
    level: z.number().optional(),
    desc: z.string().optional(),
    color: z.string().optional(),
    icon: z.string().optional(),
    routes: z.array(z.string()).optional(),
    sort: z.number().optional(),
    flag: z.number().optional(),
  }).partial(),
}
