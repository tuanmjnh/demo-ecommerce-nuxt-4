import { z } from 'zod'

export const ProductValidation = {
  create: z.object({
    code: z.string().min(1, 'Code is required').transform(val => val.toUpperCase()),
    title: z.string().min(1, 'Title is required'),
    groups: z.array(z.string()).optional(),
    slug: z.string().optional(),
    desc: z.string().optional(),
    content: z.string().optional(),
    // Numeric fields
    priceSelling: z.number().optional(),
    pricePromotional: z.number().optional(),
    quantity: z.number().optional(),
    weight: z.number().optional(),
    sort: z.number().default(1),
    flag: z.number().default(1),
    // String fields
    unit: z.string().optional(),
    brand: z.string().optional(),
    originName: z.string().optional(),
    originAddress: z.string().optional(),
    warranty: z.string().optional(),
    // Arrays & Objects (simplified as any for flexibility, can be strict if needed)
    variants: z.array(z.any()).optional(),
    stocks: z.array(z.any()).optional(),
    image: z.any().optional(),
    images: z.array(z.any()).optional(),
    tags: z.array(z.string()).optional(),
    attributes: z.array(z.any()).optional(),
    meta: z.array(z.any()).optional(),
    pins: z.array(z.string()).optional(),
  }),

  update: z.object({
    code: z.string().min(1).transform(val => val.toUpperCase()).optional(),
    title: z.string().min(1).optional(),
    groups: z.array(z.string()).optional(),
    slug: z.string().optional(),
    desc: z.string().optional(),
    content: z.string().optional(),
    priceSelling: z.number().optional(),
    pricePromotional: z.number().optional(),
    quantity: z.number().optional(),
    weight: z.number().optional(),
    sort: z.number().optional(),
    flag: z.number().optional(),
    unit: z.string().optional(),
    brand: z.string().optional(),
    originName: z.string().optional(),
    originAddress: z.string().optional(),
    warranty: z.string().optional(),
    variants: z.array(z.any()).optional(),
    stocks: z.array(z.any()).optional(),
    image: z.any().optional(),
    images: z.array(z.any()).optional(),
    tags: z.array(z.string()).optional(),
    attributes: z.array(z.any()).optional(),
    meta: z.array(z.any()).optional(),
    pins: z.array(z.string()).optional(),
  }).partial(),

  // Advanced Search (getItems)
  items: z.object({
    text: z.string().optional(),
    groups: z.array(z.string()).optional(),
    flag: z.number().optional(),
    page: z.number().optional(),
    limit: z.number().optional(),
    sortBy: z.string().optional(),
    sortType: z.number().optional(),
  }),

  // Stock Update
  stock: z.object({
    stocks: z.array(z.any()) // Define strict stock schema if needed
  })
}
