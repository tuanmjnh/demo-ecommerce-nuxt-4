export { }
declare global {
  namespace Models {
    export interface Menu {
      title: string,
      desc?: string | null;
      locations: Common.MenuLocationType[];
      pid?: string | null, // Parent menu id
      level: number;
      sort: number,
      type: Common.MenuType,
      refId: string | null, // category/post/product
      url?: string | null, // if it is an external link
      path?: string;
      target: Common.MenuTargetType; // _self hoặc _blank
      rel?: string | null; // "nofollow noopener" (for SEO external link)
      icon: string,
      image?: Common.IFileAttach | null; // thumbnail (for Mega Menu)
      cssClass?: string | null; // Private class if you want to highlight (e.g. red "Contact" button)
      flag: number, // 1: Show, 0: Hide
      /** --- 9. SYSTEM AUDIT --- */
      history?: Common.IChangeData[] | null // Edit history log
      createdAt?: number; // Timestamp
      updatedAt?: number; // Timestamp
    }
    export interface IMenu extends Menu {
      _id?: string
    }
    export interface IMenuTree extends IMenu {
      children?: IMenuTree[]
    }
  }
}
