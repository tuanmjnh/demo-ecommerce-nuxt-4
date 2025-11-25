import { z } from 'zod'

export const GroupValidation = {
  // Schema for creating a new group
  create: z.object({
    key: z.string().min(1, 'Key is required'),
    code: z.string().min(3, 'Code must be at least 3 characters').transform(val => val.toUpperCase()),
    title: z.string().min(1, 'Title is required'),
    name: z.string().min(1, 'Name is required'),
    component: z.string().min(1, 'Component is required'),
    // Optional fields
    parent: z.string().nullable().optional(),
    desc: z.string().optional(),
    level: z.number().default(1),
    quantity: z.number().optional(),
    position: z.array(z.string()).default(['left']),
    tags: z.array(z.string()).optional(),
    icon: z.string().optional(),
    color: z.string().optional(),
    sort: z.number().default(1),
    flag: z.number().default(1),
    type: z.string().default('page'),
    path: z.string().default('/'),
    redirect: z.string().nullable().optional(),
    content: z.string().optional(),
    url: z.string().optional(),
    // Allow other fields to pass through if needed, or define them explicitly
    seo: z.any().optional(),
    image: z.any().optional(),
    images: z.array(z.any()).optional(),
    time: z.any().optional(),
    children: z.array(z.any()).optional(),
    meta: z.any().optional(),
    // Manual slug override
    slug: z.string().optional(),
    slugFull: z.string().optional(),
  }),

  // Schema for updating (Partial makes all fields optional)
  update: z.object({
    key: z.string().min(1),
    code: z.string().min(3).transform(val => val.toUpperCase()),
    title: z.string().min(1),
    name: z.string().min(1),
    component: z.string().min(1),
    parent: z.string().nullable(),
    desc: z.string(),
    slug: z.string(),
    level: z.number(),
    quantity: z.number(),
    position: z.array(z.string()),
    tags: z.array(z.string()),
    icon: z.string(),
    color: z.string(),
    sort: z.number(),
    flag: z.number(),
    type: z.string(),
    path: z.string(),
    redirect: z.string().nullable(),
    content: z.string(),
    url: z.string(),
    seo: z.any(),
    image: z.any(),
    images: z.array(z.any()),
    time: z.any(),
    children: z.array(z.any()),
    meta: z.any(),
  }).partial()
}
