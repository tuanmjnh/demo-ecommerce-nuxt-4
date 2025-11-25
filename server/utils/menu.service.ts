import { MenuModel } from '../models/menu.model'
import { GroupModel } from '../models/group.model'
import { PostModel } from '../models/post.model' // Uncomment when available
import { ProductModel } from '../models/product.model' // Uncomment when available

export const MenuService = {
  /**
   * Build hierarchical tree from flat list
   */
  async getTree() {
    // Fetch all items sorted by sort order
    const items = await MenuModel.find().lean().sort({ sort: 1 }) as any[]

    const buildTree = (pid: string | null): any[] => {
      return items
        .filter(item => String(item.pid || null) === String(pid || null))
        .map(item => ({
          ...item,
          children: buildTree(String(item._id))
        }))
    }

    return buildTree(null)
  },

  /**
   * Resolve URL based on menu type (Recursive)
   */
  async getResolvedTree() {
    const tree = await this.getTree()

    const resolveRecursive = async (nodes: any[]): Promise<any[]> => {
      return Promise.all(
        nodes.map(async node => {
          const url = await this.resolveUrl(node)
          return {
            ...node,
            url,
            children: await resolveRecursive(node.children)
          }
        })
      )
    }

    return resolveRecursive(tree)
  },

  /**
   * Helper to generate URL string based on Ref ID and Type
   */
  async resolveUrl(item: Models.IMenu): Promise<string> {
    if (item.type === 'LINK') return item.url ?? '#'

    try {
      if (item.type === 'CATEGORY') {
        const cat = await GroupModel.findById(item.refId).lean() as any
        return cat ? `/${cat.slug}` : '#'
      }
      if (item.type === 'POST') {
        const post = await PostModel.findById(item.refId).lean()
        return post ? `/${post.slug}` : '#'
      }
      if (item.type === 'PRODUCT') {
        const product = await ProductModel.findById(item.refId).lean()
        return product ? `/${product.slug}` : '#'
      }
    } catch (e) {
      // Ignore errors if refId is invalid, return #
      return '#'
    }
    return '#'
  },

  /**
   * Update multiple positions (Bulk Write for performance)
   */
  async updatePositions(items: { id: string; pid: string | null; sort: number }[]) {
    if (!items || items.length === 0) return false

    const ops = items.map(i => ({
      updateOne: {
        filter: { _id: i.id },
        update: { $set: { pid: i.pid, sort: i.sort } }
      }
    }))

    const result = await MenuModel.bulkWrite(ops)
    return result.modifiedCount > 0
  }
}
