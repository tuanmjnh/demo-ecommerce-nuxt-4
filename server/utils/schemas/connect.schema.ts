import { z } from 'zod'

export const ConnectValidation = {
  create: z.object({
    key: z.string().min(1, 'Key is required'),
    // Connect uses UPPERCASE code
    code: z.string().min(1, 'Code is required').transform(val => val.toUpperCase()),
    title: z.string().min(1, 'Title is required'),

    // Object/Array fields (flexible)
    clientID: z.any().optional(),
    credentials: z.any().optional(),
    authUri: z.string().optional(),
    redirectUris: z.array(z.string()).optional(),
    profile: z.any().optional(),
    config: z.any().optional(),

    sort: z.number().default(1),
    flag: z.number().default(1),
  }),

  update: z.object({
    key: z.string().min(1).optional(),
    code: z.string().min(1).transform(val => val.toUpperCase()).optional(),
    title: z.string().min(1).optional(),
    clientID: z.any().optional(),
    credentials: z.any().optional(),
    authUri: z.string().optional(),
    redirectUris: z.array(z.string()).optional(),
    profile: z.any().optional(),
    config: z.any().optional(),
    sort: z.number().optional(),
    flag: z.number().optional(),
  }).partial()
}
