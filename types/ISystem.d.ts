export { }
declare global {
  namespace System {
    export interface JwtPayload {
      user: Models.IUser | null
      routes: string[] | null
      // accessToken?: string | null
      refreshToken?: string | null
    }
    export interface AppConfigs {
      max_devices_pc: number
      max_devices_web: number
      max_devices_mobile: number
      max_devices_tablet: number
      route_load_mode: string
      ffmpeg_configuration_sync: boolean
      password_reset: string
      jwt_secret: string
      jwt_expire: string | number
      jwt_refresh_expire: number
      split_string: string
    }
    // export interface JwtPayload {
    //   id: any,
    //   username: string,
    //   roles: string[],
    //   group: string
    // }
    // export interface RequestMiddlewares extends Request {
    //   // verify: {
    //   //   _id: string,
    //   //   token: string,
    //   //   secret: string
    //   // }
    //   user: JwtPayload,
    // }
  }
}
