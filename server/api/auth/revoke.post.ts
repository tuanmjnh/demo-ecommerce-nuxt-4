import { AuthService } from '../../utils/auth.service'

export default defineEventHandler(async (event) => {
  const auth = ensureAuth(event)
  const rs = { type: 'auth-revoke', message: 'success', status: true }

  try {
    const body = await validateBody(event, AuthValidation.revoke)

    if (auth.user?._id) await AuthService.revokeDevice(auth.user?._id, body.deviceId)
    return rs

  } catch (error: any) {
    // if (error.statusCode) throw error
    throw createError({ statusCode: 400, statusMessage: 'revokeFailed', message: error.message })
  }
})
