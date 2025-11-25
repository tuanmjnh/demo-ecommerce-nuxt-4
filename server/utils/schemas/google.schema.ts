import { z } from 'zod'

export const GoogleValidation = {
  callback: z.object({
    code: z.string().min(1, 'Missing code'),
    redirectUri: z.string().optional()
  })
}
