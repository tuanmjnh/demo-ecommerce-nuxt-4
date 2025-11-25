import { google } from 'googleapis'

export const SCOPES_PROFILE = [
  'https://www.googleapis.com/auth/userinfo.profile',
]

export const SCOPES_DRIVE = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.appdata',
  'https://www.googleapis.com/auth/drive.file'
]

/**
 * Helper to get OAuth2 Client instance
 */
const getOAuth2Client = (redirectUri?: string) => {
  const config = useRuntimeConfig()
  return new google.auth.OAuth2(
    config.googleClientId,
    config.googleClientSecret,
    redirectUri || config.googleRedirectUri
  )
}

export const GoogleService = {
  /**
   * 🔐 Create OAuth2 client and attach API
   */
  async authorize(credentials?: any, redirectUri?: string, api?: 'drive' | 'sheets' | 'gmail') {
    const oAuth2Client = getOAuth2Client(redirectUri)

    // Load credentials
    if (credentials) {
      oAuth2Client.setCredentials(credentials)

      // Optional: Auto refresh if expired logic could go here,
      // but usually googleapis handles this if refresh_token is present
    }

    // If no api passed, just return auth
    if (!api) return { auth: oAuth2Client }

    // Return corresponding API client
    switch (api) {
      case 'drive':
        return { auth: oAuth2Client, drive: google.drive({ version: 'v3', auth: oAuth2Client }) }
      case 'sheets':
        return { auth: oAuth2Client, sheets: google.sheets({ version: 'v4', auth: oAuth2Client }) }
      case 'gmail':
        return { auth: oAuth2Client, gmail: google.gmail({ version: 'v1', auth: oAuth2Client }) }
      default:
        return { auth: oAuth2Client }
    }
  },

  /**
   * 🎯 Generate Auth URL
   */
  generateAuthUrl(redirectUri?: string) {
    const oAuth2Client = getOAuth2Client(redirectUri)
    return oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent', // Force consent to ensure refresh_token is returned
      scope: SCOPES_DRIVE, // Adjust scopes as needed
    })
  },

  /**
   * 🎯 Exchange code for tokens
   */
  async getTokenByCode(code: string, redirectUri?: string) {
    try {
      const oAuth2Client = getOAuth2Client(redirectUri)
      const { tokens } = await oAuth2Client.getToken(code)
      return tokens
    } catch (error: any) {
      throw new Error('Failed to exchange code for tokens: ' + error.message)
    }
  },

  /**
   * 🧩 Verify ID Token
   */
  async verifyIdToken(idToken: string, redirectUri?: string) {
    const config = useRuntimeConfig()
    try {
      const oAuth2Client = getOAuth2Client(redirectUri)
      const ticket = await oAuth2Client.verifyIdToken({
        idToken,
        audience: config.googleClientId,
      })
      return ticket.getPayload()
    } catch (error: any) {
      throw new Error('Invalid Google ID Token: ' + error.message)
    }
  },

  /**
   * 🔁 Refresh access token manually
   */
  async refreshAccessToken(credentials: any, redirectUri?: string) {
    try {
      const oAuth2Client = getOAuth2Client(redirectUri)
      oAuth2Client.setCredentials(credentials)
      const { credentials: newTokens } = await oAuth2Client.refreshAccessToken()
      return newTokens
    } catch (error: any) {
      throw new Error('Failed to refresh access token: ' + error.message)
    }
  }
}
