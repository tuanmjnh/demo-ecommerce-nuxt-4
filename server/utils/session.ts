import type { H3Event } from 'h3'

/**
 * Extracts and verifies the JWT access token.
 * Throws an error if invalid or missing.
 */
export const ensureAuth = (event: H3Event) => {
  const config = useRuntimeConfig()

  // 1. Extract Token
  const header = getHeader(event, 'authorization') || getHeader(event, 'x-access-token')
  if (!header) {
    throw createError({ statusCode: 401, statusMessage: 'error.noToken', message: 'No token provided' })
  }

  const token = String(header).replace(/^Bearer\s+/i, '')

  try {
    // 2. Verify Token
    const decoded: System.JwtPayload = AuthService.verifyToken(token, config.jwt_secret) //jwt.verify(token, config.jwtSecret) as System.JwtPayload

    // 3. Attach to context for later use
    event.context.auth = decoded

    return decoded
  } catch (err: any) {
    const message = err.name === 'TokenExpiredError' ? 'tokenExpired' : 'invalidToken'
    throw createError({ statusCode: 401, statusMessage: `error.${message}`, message: 'Unauthorized' })
  }
}
