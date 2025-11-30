export const useMenuState = () => {
  const flatItems = useState<Models.IMenu[]>('menu-flat-items', () => [])
  const error = useState('menu-error', () => null)

  const fetchMenu = async () => {
    if (flatItems.value.length) return

    try {
      const res = await useAPI<Common.IResponseItem>('menu/public')
      if (res?.data) {
        flatItems.value = res.data
      }
    } catch (err: any) {
      // console.error('Failed to fetch menu:', err)
      error.value = err
    }
  }

  /**
   * 1. Tree Builder (Optimized O(n) complexity)
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
      if (item._id) {
        map[item._id] = { ...item, children: [] }
      }
    })

    // Step 2: Construct the Tree
    items.forEach((item) => {
      if (!item._id) return

      const node = map[item._id]
      if (!node) return

      const parent = item.pid ? map[item.pid] : undefined

      if (parent) {
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
   */
  const uiMenuItems = computed(() => {
    const resolvePath = (item: Models.IMenuTree): string | undefined => {
      if (!item.url || item.url === '#') return undefined
      if (item.type === 'LINK') return item.url
      return item.url.startsWith('/') ? item.url : `/${item.url}`
    }

    const mapRecursive = (nodes: Models.IMenuTree[]): any[] => {
      return nodes.map(node => {
        const hasChildren = node.children && node.children.length > 0
        const path = resolvePath(node)

        return {
          label: node.title,
          to: path,
          state: {
            typeHint: node.type,
            titleHint: node.title
          },
          target: node.type === 'LINK' && node.url?.startsWith('http') ? '_blank' : undefined,
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
    treeItems,
    uiMenuItems,
    uiMenuFooter,
    fetchMenu
  }
}
