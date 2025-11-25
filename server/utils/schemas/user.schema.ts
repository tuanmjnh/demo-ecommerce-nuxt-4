import { z } from 'zod'

export const UserValidation = {
  create: z.object({
    username: z.string().min(3, 'Username must be at least 3 chars'),
    password: z.string().min(6, 'Password must be at least 6 chars'),
    fullName: z.string().min(1, 'Full Name is required'),
    email: z.string().email().optional().or(z.literal('')),
    groups: z.array(z.string()).min(1, 'At least one group is required'),
    phone: z.string().optional(),
    personNumber: z.string().optional(),
    region: z.string().optional(),
    about: z.string().optional(),
    dateBirth: z.number().optional(),
    gender: z.string().optional(),
    address: z.string().optional(),
    roles: z.array(z.string()).optional(),
    avatar: z.any().optional(),
    verified: z.boolean().default(false),
    flag: z.number().default(1),
  }),

  update: z.object({
    username: z.string().min(3).optional(),
    // Password update usually handled separately, but allowed here if needed (hashed in service)
    fullName: z.string().min(1).optional(),
    email: z.string().email().optional().or(z.literal('')),
    groups: z.array(z.string()).optional(),
    phone: z.string().optional(),
    personNumber: z.string().optional(),
    region: z.string().optional(),
    about: z.string().optional(),
    dateBirth: z.number().optional(),
    gender: z.string().optional(),
    address: z.string().optional(),
    roles: z.array(z.string()).optional(),
    avatar: z.any().optional(),
    verified: z.boolean().optional(),
    flag: z.number().optional(),
  }).partial(),

  updateProfile: z.object({
    fullName: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    personNumber: z.string().optional(),
    region: z.string().optional(),
    about: z.string().optional(),
    dateBirth: z.number().optional(),
    gender: z.string().optional(),
    address: z.string().optional(),
    avatar: z.any().optional(),
  }),

  changePassword: z.object({
    oldPassword: z.string().min(1, 'Old password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 chars'),
  }),

  resetPassword: z.object({
    newPassword: z.string().min(6, 'New password must be at least 6 chars'),
  }),

  // Advanced Search
  items: z.object({
    text: z.string().optional(),
    groups: z.array(z.string()).optional(),
    flag: z.number().optional(),
    page: z.number().optional(),
    limit: z.number().optional(),
    sortBy: z.string().optional(),
    sortType: z.number().optional(),
  })
}
