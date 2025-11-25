export { }
declare global {
  namespace Models {
    export interface Role {
      key: string
      code: string
      title: string
      desc?: string
      level: number
      color?: string
      icon?: string
      routes?: string[]
      sort: number
      flag: number
      created: Common.IChangeData | null
      updated?: Common.IChangeData | null
    }
    export interface IRole extends Role {
      _id?: string
    }
  }
}
