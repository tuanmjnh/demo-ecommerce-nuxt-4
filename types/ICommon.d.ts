export { }
declare global {
  namespace Common {
    export type TypeLanguage = 'vi' | 'en' | 'zh' | 'ja' | 'ko'
    export type TypeStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED' | 'PRIVATE' | 'TRASH' | 'FUTURE'
    export type DeviceType = 'pc' | 'mobile' | 'tablet' | 'web'
    export type BillingStatusType = 'empty' | 'serving' | 'reserved' | 'paid' | 'cancelled'
    export type ReportType = 'day' | 'week' | 'month' | 'year'
    export type ConfigType = 'string' | 'number' | 'boolean'
    export type RouteType = 'dir' | 'page'
    export type MenuType = 'PAGE' | 'CATEGORY' | 'POST' | 'CATEGORY-POST' | 'PRODUCT' | 'CATEGORY-PRODUCT' | 'LINK' | 'MODULE'

    export interface ILastAccess {
      at: number
      ip: string | null
    }

    export interface IChangeData extends ILastAccess {
      by: string
    }

    export interface ITimeEvent {
      start: number
      end: number
      label: string
    }

    export interface IMeta {
      key: string
      value: string
    }

    export interface ISeoData {
      title?: string
      desc?: string
      tags?: string[]
    }

    export interface IPostStatsData {
      views: number
      likes: number
      shares: number
      comments: number
      ratingCount: number
      ratingAverage: number
    }

    export interface ISocialData {
      zalo?: string
      facebook?: string
      instagram?: string
      youtube?: string
      tiktok?: string
      linkedin?: string
    }

    export enum EConfigType {
      STRING = 'string',
      INT = 'int',
      FLOAT = 'float',
      BOOLEAN = 'boolean',
      DATE = 'date'
    }

    export interface IFileAttach {
      _id?: string
      public_id?: string
      display_name?: string
      url: string
      format?: string
      bytes?: number
      created_at?: number
    }


    export interface IResponseAuth {
      accessToken?: string | null
      refreshToken?: string | null
      routes: any[] | null
      user: any | null
      status: boolean
      type?: string
      message?: string
    }

    export interface IResponseItem {
      data?: any | null
      status: boolean
      type?: string
      message?: string
    }

    export interface IData {
      items?: any
      total: number
      page?: number
      pages?: number
      limit?: number
      sort?: string
    }

    export interface IResponseItems {
      data?: IData | null
      status: boolean
      type?: string
      message?: string
    }

    export interface IResponseArray {
      success: any[]
      error: any[]
      status: boolean
      type?: string
      message?: string
    }
  }
}
