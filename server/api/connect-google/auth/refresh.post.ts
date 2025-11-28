import { ConnectService } from '../../../utils/connect.service'
import { GoogleService } from '../../../utils/google.service'

export default defineEventHandler(async (event) => {
  const rs = { success: true, message: 'Refreshed access token successfully', data: null }

  try {
    const connect = await ConnectService.getByKey('GOOGLE')
    if (!connect.credentials) {
      throw createError({ statusCode: 400, message: 'No credentials stored' })
    }

    const newTokens = await GoogleService.refreshAccessToken(connect.credentials)

    // Update DB
    await ConnectService.updateCredentials('GOOGLE', newTokens, connect.profile)

    rs.data = newTokens as any
    return rs

  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error', message: error.message })
  }
})
