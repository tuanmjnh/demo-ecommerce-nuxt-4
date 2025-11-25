export { }
declare global {
  namespace Models {
    export interface Group {
      key: string
      code: string
      parent?: string | null
      title: string
      slug: string // SEO-friendly link
      slugFull: string, // SEO + Rewrite -> example: /tin-tuc/cong-nghe
      seo?: Common.ISeoData // SEO configuration
      desc: string
      level: number
      content?: string
      url?: string
      image?: Common.IFileAttach
      images?: Common.IFileAttach[]
      quantity?: number
      position?: string[]
      tags?: string[]
      icon?: string
      color?: string
      meta?: Common.IMeta[]
      time?: Common.ITimeEvent
      sort: number
      status?: string | null
      flag: number
      type: string | null
      name: string
      path: string
      redirect?: string | null
      component: string | null
      children?: object[] | null
      created: Common.IChangeData | null
      updated?: Common.IChangeData | null
    }
    export interface IGroup extends Group {
      _id?: string
    }
  }
}
