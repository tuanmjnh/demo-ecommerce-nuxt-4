import { ConnectService } from '../../../utils/connect.service' // Adjust path if needed
import { GoogleService } from '../../../utils/google.service'

export default defineEventHandler(async (event) => {
  // ensureAuth(event) // Uncomment if only admin can connect
  const rs = { success: true, message: 'success', url: '' }

  try {
    // Get Config from DB
    const connect = await ConnectService.getByKey('GOOGLE')
    const config = useRuntimeConfig()

    // Determine Redirect URI
    // Priority: DB Config -> Env Config -> Default
    const redirectUri = connect.redirectUris?.[0] || config.googleRedirectUri || 'http://localhost:3000'

    // Generate URL
    const url = GoogleService.generateAuthUrl(redirectUri)

    // Update DB with current config
    await ConnectService.updateClientConfig('GOOGLE', {
      authUri: url,
      redirectUris: [redirectUri],
    })

    rs.url = url
    return rs

  } catch (error: any) {
    throw createError({ statusCode: 500, message: error.message })
  }
})
