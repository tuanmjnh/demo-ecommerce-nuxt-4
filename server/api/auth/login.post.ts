import { AuthService } from '../../utils/auth.service'

export default defineEventHandler(async (event) => {
  const rs: Common.IResponseAuth = { type: 'auth-login', status: true, message: 'success', user: null, routes: [], accessToken: null, refreshToken: null }

  try {
    const body = await validateBody(event, AuthValidation.login)
    const config = useRuntimeConfig()
    const key = ('max_devices_' + body.deviceType.toLowerCase()) as keyof System.AppConfigs

    const maxAllowed = parseInt(String(config[key])) || 0
    const result = await AuthService.login({
      username: body.username,
      password: body.password,
      deviceId: body.deviceId,
      deviceType: body.deviceType,
      deviceName: body.deviceName,
      jwtSecret: config.jwt_secret,
      jwtExpire: config.jwt_expire,
      jwtRefreshExpire: config.jwt_refresh_expire,
      maxAllowed: maxAllowed,
      userAgent: getHeader(event, 'user-agent') || 'unknown',
      ip: getRequestIP(event) || null
    })

    Object.assign(rs, result)
    return rs

  } catch (error: any) {
    console.log(error)
    if (error.statusCode) throw error
    if (error.message === 'invalidCredentials') {
      throw createError({ statusCode: 401, statusMessage: 'error.invalidCredentials', message: 'Wrong username or password' })
    }
    if (error.message === 'deviceLimited') {
      throw createError({ statusCode: 403, statusMessage: 'error.deviceLimited', message: 'Device limit reached' })
    }

    throw createError({ statusCode: 400, statusMessage: 'error.loginFailed', message: error.message })
  }
})
