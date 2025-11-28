import { ConnectService } from '../../../utils/connect.service'
import { GoogleService } from '../../../utils/google.service'

export default defineEventHandler(async (event) => {
  const rs = { success: true, message: 'Authorized successfully', data: null }

  try {
    // const body = await validateBody(event, GoogleValidation.callback)
    const { code, redirectUri } = await readBody(event)

    const connect = await ConnectService.getByKey('GOOGLE')
    const config = useRuntimeConfig()

    // Fallback redirect URI
    const redirect = redirectUri || connect.redirectUris?.[0] || config.googleRedirectUri

    // 1. Exchange Code for Tokens
    const tokens = await GoogleService.getTokenByCode(code, redirect)

    // 2. Verify ID Token (to get user profile)
    let userProfile: any = null
    if (tokens.id_token) {
      userProfile = await GoogleService.verifyIdToken(tokens.id_token, redirect)
    }

    // 3. Save to DB
    await ConnectService.updateCredentials('GOOGLE', tokens, userProfile)

    rs.data = { tokens, profile: userProfile } as any
    return rs

  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error', message: error.message })
  }
})
