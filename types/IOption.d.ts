export { }
declare global {
  namespace Models {
    export interface Options {
      key: string
      code: string
      title: string
      desc?: string
      meta?: Common.IMeta[]
      sort: number
      flag: number
      created: Common.IChangeData | null
      updated?: Common.IChangeData | null
    }
    export interface IOptions extends Options {
      _id?: string
    }
  }
}
