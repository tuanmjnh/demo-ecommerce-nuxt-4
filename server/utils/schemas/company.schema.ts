import { z } from 'zod'

export const CompanyValidation = {
  // Schema for update (partial allow)
  update: z.object({
    name: z.string().min(1, 'Name is required').optional(),
    shortName: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    fax: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    hotline: z.string().optional(),
    taxCode: z.string().optional(),
    mapEmbed: z.string().optional(),
    openingHours: z.string().optional(),

    // Objects/Arrays
    logo: z.any().optional(),
    banner: z.any().optional(),
    images: z.array(z.any()).optional(),
    social: z.any().optional(),
    seo: z.any().optional(),

    // Meta
    flag: z.number().optional(),
  })
}
