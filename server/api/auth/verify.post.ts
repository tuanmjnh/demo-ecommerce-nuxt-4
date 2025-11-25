import { AuthService } from '../../utils/auth.service'

export default defineEventHandler(async (event) => {
  const rs = { type: 'auth-verify', message: 'success', status: true }

  try {
    const body = await validateBody(event, AuthValidation.verify)
    const config = useRuntimeConfig()
    // This throws if invalid
    AuthService.verifyToken(body.accessToken, config.jwt_secret)

    return rs

  } catch (error: any) {
    throw createError({ statusCode: 401, statusMessage: 'error.expired', message: 'Token expired or invalid' })
  }
})
