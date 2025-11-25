export { }
declare global {
  namespace Models {
    /** Meta identifier carried by a single route */
    export interface RouteMeta {
      /* Page title, usually required. */
      title: string
      /* Group type */
      group?: string | null
      /* Icon, usually used with menu */
      icon?: string | null
      /* Whether login permission is required. */
      require?: boolean
      /* allow access with all roles */
      access?: boolean
      /* Accessible roles */
      // roles?: Entity.RoleType[]
      /* Whether to enable page cache */
      keep?: boolean
      /* Some routes we don't want to display in the menu, such as some edit pages. */
      hide?: boolean
      /* Nested external links */
      href?: string | null
      /** The current route is not displayed in the left menu, but a menu needs to be highlighted */
      active?: string | null
      /** Will the current route be added to the Tab */
      tab?: boolean
      /** Will the current route be fixed in the Tab for some permanent pages */
      pin?: boolean
      /** Is the current route a directory or a page in the left menu? If not set, the default is page */
      type?: Common.RouteType
      /* Menu sorting. */
      sort?: number
      /* Menu status */
      flag?: number
      /* create info */
      created?: Common.IChangeData | null
      /* updated info */
      updated?: Common.IChangeData | null
    }

    export type MetaKeys = keyof RouteMeta

    export interface RouteMetaExtra {
      id: number | string | null
      /* Parent route id, null for top-level page */
      pid: number | string | null
      /** Route name (route unique identifier) ​​ */
      name: string
      /** Route path */
      path: string
      /** Route redirection */
      redirect?: string | null
      /* Page component address */
      component?: string | null
    }

    export type RouteDocument = RouteMeta & RouteMetaExtra
    export interface RouteBase extends RouteMetaExtra {
      /* Route id */
      _id?: number | string | null
    }

    /** The type structure of a single route (dynamic routing mode: the backend returns a route of this type of structure) */
    export type RouteItem = RouteMeta & RouteBase

    /** The actual routing structure mounted on the project */
    export interface Route extends RouteBase {
      /** Subrouting */
      children?: any[]
      /* Page Components */
      component: any
      /** Route Description */
      meta: RouteMeta
    }
  }
}
