// server/api/resolve-slug.ts
import { MenuModel } from '../../models/menu.model'
import { PostModel } from '../../models/post.model'
import { GroupModel } from '../../models/group.model'
import { ProductModel } from '../../models/product.model'
// Import other models (Product, Category...)

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const slug = String(query.url || '').replace(/^\//, '') // Remove the / at the beginning

  // 1. CALL THE CONNECT FUNCTION HERE (It has a check if connected mechanism so there is no fear of redundancy)
  await connectToMongoDB(config.mongodbUri, config.mongodbName)

  // 1. Look in the MENU table to see what this URL corresponds to
  // Since your Menu contains a refId and type, this is the best place to look
  const menuItem = await MenuModel.findOne({ url: slug }).lean<Models.IMenu>()

  let contentData = null
  let type = null

  if (menuItem) {
    // 2. Based on Type and RefId in Menu to get detailed content
    type = menuItem.type
    const { refId } = menuItem
    switch (type) {
      case 'POST':
        contentData = await PostModel.findById(refId).populate({ path: 'groups', model: GroupModel }).lean<Models.IPost>()
        break
      case 'PAGE':
        contentData = await PostModel.findById(refId).populate({ path: 'groups', model: GroupModel }).lean<Models.IPost>()
        break
      case 'PRODUCT':
        contentData = await ProductModel.findById(refId).populate({ path: 'groups', model: GroupModel }).lean<Models.IProduct>()
        break
      case 'CATEGORY':
        contentData = await GroupModel.findById(refId).lean<Models.IGroup>()
        // Add logic to get list of child posts if needed
        break
      default: break
    }
  } else {
    // Fallback: Check PostModel, ProductModel, GroupModel directly by slug

    // Check Post
    const post = await PostModel.findOne({ slug }).populate({ path: 'groups', model: GroupModel }).lean<Models.IPost>()
    if (post) {
      contentData = post
      type = post.type === 'project' ? 'PROJECT' : 'POST' // Map internal type to component type
      if (post.type === 'page') type = 'PAGE'
    }

    // Check Product if not found
    if (!contentData) {
      const product = await ProductModel.findOne({ slug }).populate({ path: 'groups', model: GroupModel }).lean<Models.IProduct>()
      if (product) {
        contentData = product
        type = 'PRODUCT'
      }
    }

    // Check Group if not found
    if (!contentData) {
      const group = await GroupModel.findOne({ slug }).lean<Models.IGroup>()
      if (group) {
        contentData = group
        type = 'CATEGORY'
      }
    }
  }

  if (!contentData) {
    throw createError({ statusCode: 404, message: 'noExistContent' })
  }

  // 3. Return the standard format for [...slug].vue to display
  return {
    // title: contentData.title || menuItem.title, // Title from menu (or get contentData.title)
    ...contentData, // Merge detailed content into
    type: type, // Let the frontend know which component to select (PostDetail, PageDetail...)
  }
})
