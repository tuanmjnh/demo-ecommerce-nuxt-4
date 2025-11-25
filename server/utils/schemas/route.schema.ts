import { z } from 'zod'

export const RouteValidation = {
  create: z.object({
    // Auto lowercase name
    name: z.string().min(1, 'Name is required').transform(val => val.toLowerCase()),
    // Code is optional in schema but handled in logic (if provided, transform to upper)
    code: z.string().optional().transform(val => val?.toUpperCase()),

    path: z.string().min(1, 'Path is required'),
    title: z.string().min(1, 'Title is required'),

    // Optional fields
    id: z.number().nullable().optional(),
    pid: z.number().nullable().optional(),
    component: z.string().nullable().optional(),
    group: z.string().nullable().optional(),
    icon: z.string().nullable().optional(),

    // Booleans
    require: z.boolean().default(true),
    access: z.boolean().default(false),
    keep: z.boolean().default(false),
    hide: z.boolean().default(false),
    tab: z.boolean().default(true),
    pin: z.boolean().default(false),

    redirect: z.string().nullable().optional(),
    href: z.string().nullable().optional(),
    active: z.string().nullable().optional(),
    type: z.enum(['dir', 'page']).default('page'),

    sort: z.number().default(1),
    flag: z.number().default(1),
  }),

  update: z.object({
    name: z.string().min(1).transform(val => val.toLowerCase()).optional(),
    code: z.string().transform(val => val?.toUpperCase()).optional(),
    path: z.string().min(1).optional(),
    title: z.string().min(1).optional(),
    id: z.number().nullable().optional(),
    pid: z.number().nullable().optional(),
    component: z.string().nullable().optional(),
    group: z.string().nullable().optional(),
    icon: z.string().nullable().optional(),
    require: z.boolean().optional(),
    access: z.boolean().optional(),
    keep: z.boolean().optional(),
    hide: z.boolean().optional(),
    tab: z.boolean().optional(),
    pin: z.boolean().optional(),
    redirect: z.string().nullable().optional(),
    href: z.string().nullable().optional(),
    active: z.string().nullable().optional(),
    type: z.string().optional(),
    sort: z.number().optional(),
    flag: z.number().optional(),
  }).partial()
}
