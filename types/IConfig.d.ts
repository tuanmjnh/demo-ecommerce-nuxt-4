export { }
declare global {
  namespace Models {
    export interface Config {
      key: string
      code: string
      value: string
      type: Common.ConfigType
      title: string
      level: number
      desc?: string
      sort: number
      flag: number
      version: number
      created: Common.IChangeData | null
      updated?: Common.IChangeData | null
      // createdAt: number
      // updatedAt: number
    }
    export interface IConfig extends Config {
      _id?: string
    }
  }
}
