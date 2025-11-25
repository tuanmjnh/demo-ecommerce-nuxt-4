import { ConnectModel } from '../models/connect.model'

export const ConnectService = {
  /** * 🔹 Get configuration information by key (GOOGLE, FACEBOOK, TIKTOK, ...)
   */
  async getByKey(key: string) {
    const connect = await ConnectModel.findOne({ key })
    if (!connect) throw new Error(`No configuration found for ${key}`)
    return connect
  },

  /** * 🔹 Save credentials (token, refresh_token, profile)
   */
  async updateCredentials(key: string, credentials: any, profile?: any) {
    return ConnectModel.updateOne(
      { key },
      {
        $set: {
          credentials,
          ...(profile && { profile }),
          updated: { at: Date.now(), by: 'system' }
        }
      }
    )
  },

  /** * 🔹 Save clientID / redirectUris (if new)
   */
  async updateClientConfig(key: string, data: any) {
    return ConnectModel.updateOne(
      { key },
      { $set: data }
    )
  },

  // Google OAuth Data Formatter
  googleDataReturn(data: Models.IConnect) {
    return {
      _id: data._id,
      title: data.title,
      key: data.key,
      code: data.code,
      access_token: data.credentials && data.credentials.access_token ? data.credentials.access_token : null,
      clientID: data.clientID,
      credentials: data.credentials && data.credentials.access_token ? data.credentials.access_token : null,
      authUri: data.authUri,
      redirectUris: data.redirectUris,
      profile: {
        email: data.profile?.email,
        email_verified: data.profile?.email_verified,
        name: data.profile?.name,
        picture: data.profile?.picture,
        given_name: data.profile?.given_name,
        family_name: data.profile?.family_name,
        iat: data.profile?.iat,
        exp: data.profile?.exp
      },
      config: data.config,
      sort: data.sort,
      flag: data.flag,
      created: data.created
    }
  }
}
