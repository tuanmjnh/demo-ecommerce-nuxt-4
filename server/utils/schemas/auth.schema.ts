import { z } from 'zod'

const deviceTypes = ['pc', 'mobile', 'tablet', 'web'] as const

export const AuthValidation = {
  register: z.object({
    username: z.string().min(3, 'Username must be at least 3 chars'),
    password: z.string().min(6, 'Password must be at least 6 chars'),
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email().optional(),
    // Add other fields as needed
  }),

  login: z.object({
    username: z.string().min(1),
    password: z.string().min(1),
    deviceId: z.string().min(1),
    deviceType: z.enum(deviceTypes).default('web'),
    deviceName: z.string().optional(),
  }),

  refresh: z.object({
    deviceId: z.string().min(1),
    refreshToken: z.string().min(1)
  }),

  verify: z.object({
    accessToken: z.string().min(1)
  }),

  revoke: z.object({
    deviceId: z.string().min(1)
  })
}
