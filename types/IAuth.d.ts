export { }
declare global {
  namespace Models {
    export interface ILogin {
      username: string
      password: string
      remember: boolean
    }
    export interface Auth {
      userId: string
      deviceId: string
      deviceName?: string
      deviceType: Common.DeviceType
      accessToken: string
      refreshToken: string
      refreshExpireAt?: number | null
      ip?: string | null
      userAgent?: string | null
      flag: number
      createdAt: number | null
      updatedAt: number | null
    }

    export interface IAuth extends Auth {
      _id?: string
    }
  }
}
