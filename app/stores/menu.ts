// stores/menu.ts
import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menuStore', () => {
  // --- STORE ---
  // const appStore = useAppStore()

  // --- STATE ---
  const flatItems = ref<Models.IMenu[]>([])
  const error = ref(null)
  // --- ACTIONS ---
  async function fetchMenu() {
    // 1. Cache Check (Cookie/Persist)
    if (flatItems.value.length > 0) return

    // try {
    // 2. Gọi API (Dùng useAPI raw fetcher)
    const res = await useAPI<Common.IResponseItem>('menu/public')
    if (!res || !res.data) return
    // if (res.data) {
    flatItems.value = res.data
    // console.log(res.data)
  }

  // --- GETTERS ---

  /**
   * 1. Tree Builder (Optimized O(n) complexity)
   * Converts the flat array from the database into a hierarchical tree structure.
   */
  const treeItems = computed(() => {
    if (!flatItems.value.length) return []

    // Deep clone to prevent mutating the original state
    const items: Models.IMenu[] = JSON.parse(JSON.stringify(flatItems.value))

    // Map to store references by ID for O(1) lookup
    const map: Record<string, Models.IMenuTree> = {}
    const roots: Models.IMenuTree[] = []

    // Step 1: Initialize the Map
    items.forEach((item) => {
      // TS FIX: Ensure _id exists before using it as a key
      if (item._id) {
        map[item._id] = { ...item, children: [] }
      }
    })

    // Step 2: Construct the Tree
    items.forEach((item) => {
      // Safety check: ensure current item has an ID
      if (!item._id) return

      const node = map[item._id]
      if (!node) return

      // 1. Try to find the parent node if pid exists
      // We assign it to a variable 'parent' so TypeScript knows it's not undefined
      const parent = item.pid ? map[item.pid] : undefined

      // 2. logic: If parent exists in our map, add to children. Otherwise, it's a root.
      if (parent) {
        // We use 'parent.children?.push' because 'children' is optional in the interface
        parent.children?.push(node)
      } else {
        roots.push(node)
      }
    })

    // Step 3: Recursive Sort Helper
    const sortRecursive = (nodes: Models.IMenuTree[]): Models.IMenuTree[] => {
      return nodes
        .sort((a, b) => (a.sort || 0) - (b.sort || 0))
        .map(node => {
          if (node.children?.length) {
            node.children = sortRecursive(node.children)
          }
          return node
        })
    }

    return sortRecursive(roots)
  })

  /**
   * 2. UI Mapper (For Nuxt UI)
   * Transforms the Raw Tree into the format required by UNavigationMenu.
   * Automatically resolves the URL based on the menu 'type'.
   */
  const uiMenuItems = computed(() => {

    // Helper: Generate URL path based on menu Type and Slug/URL
    const resolvePath = (item: Models.IMenuTree): string | undefined => {
      if (!item.url || item.url === '#') return undefined
      if (item.type === 'LINK') return item.url
      return item.url.startsWith('/') ? item.url : `/${item.url}`
    }

    // Recursive Mapper Function
    const mapRecursive = (nodes: Models.IMenuTree[]): any[] => {
      return nodes.map(node => {
        const hasChildren = node.children && node.children.length > 0
        const path = resolvePath(node)

        return {
          label: node.title,
          // icon: node.icon,
          // Nuxt UI will automatically handle 'active' state if 'to' matches the current route
          to: path,
          state: {
            typeHint: node.type,
            titleHint: node.title
          },
          // Optional: Open external links in a new tab
          target: node.type === 'LINK' && node.url?.startsWith('http') ? '_blank' : undefined,

          // Recursively map children
          children: hasChildren ? mapRecursive(node.children!) : undefined
        }
      })
    }

    return mapRecursive(treeItems.value)
  })

  const uiMenuFooter = computed(() => {
    const items = flatItems.value.filter(item => item.locations.includes('FOOTER_1'))
    return items
  })

  return {
    error,
    flatItems,
    treeItems,   // Use this if you need raw tree data (e.g., for an Edit Form)
    uiMenuItems, // Use this for rendering the <UNavigationMenu />
    uiMenuFooter,
    fetchMenu
  }
})//, {
// Enable Pinia Persistence (cookies) to prevent double-fetching on hydration
// persist: true
// })
