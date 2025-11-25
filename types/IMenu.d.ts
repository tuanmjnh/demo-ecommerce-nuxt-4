export { }
declare global {
  namespace Models {
    export interface Menu {
      title: string,
      type: Common.MenuType,
      refId: string | null, // category/post/product
      url?: string | null, // if it is an external link
      pid?: string | null, // Parent menu id
      icon: string,
      sort: number,
      flag: number,
      created: Common.IChangeData | null
      updated?: Common.IChangeData | null
    }
    export interface IMenu extends Menu {
      _id?: string
    }
    export interface IMenuTree extends IMenu {
      children?: IMenuTree[]
    }
  }
}
