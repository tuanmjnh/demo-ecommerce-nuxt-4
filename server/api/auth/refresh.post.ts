import { AuthService } from '../../utils/auth.service'

export default defineEventHandler(async (event) => {
  const rs = { type: 'auth-refresh', message: 'success', status: true, data: null }

  try {
    const body = await validateBody(event, AuthValidation.refresh)

    // We don't need the expired access token here because we rely on deviceId + refreshToken
    // However, if your logic strictly requires userId to match, you can decode the old token from header (without verifying exp)
    // For now, AuthService.refresh finds session by deviceId

    const result = await AuthService.refresh({
      deviceId: body.deviceId,
      refreshToken: body.refreshToken
    })

    rs.data = result as any
    // Also set header for convenience
    setHeader(event, 'x-access-token', result.accessToken)

    return rs

  } catch (error: any) {
    // if (error.statusCode) throw error

    // if (['invalidRefreshToken', 'refreshExpired', 'noExistAccount'].includes(error.message)) {
    //   throw createError({ statusCode: 401, statusMessage: `error.${error.message}`, message: 'Session expired' })
    // }

    throw createError({ statusCode: 400, statusMessage: 'invalidRefreshToken', message: error.message })
  }
})
