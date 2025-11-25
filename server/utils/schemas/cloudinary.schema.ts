import { z } from 'zod'

export const CloudinaryValidation = {
  createFolder: z.object({
    name: z.string().min(1, 'Folder path is required')
  }),

  rename: z.object({
    from: z.string().min(1, 'Source path is required'),
    to: z.string().min(1, 'Destination path is required')
  }),

  deleteFile: z.object({
    publicId: z.string().min(1, 'Public ID is required')
  }),

  // Optional: Schema for Query params if needed strictly
  getFiles: z.object({
    folder: z.string().optional(),
    max_results: z.number().optional(), // note: query params are usually strings, need handling
  })
}
