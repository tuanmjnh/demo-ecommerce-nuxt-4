// server/api/resolve-slug.ts
import { MenuModel } from '../../models/menu.model'
import { PostModel } from '../../models/post.model'
import { GroupModel } from '../../models/group.model'
import { ProductModel } from '../../models/product.model'
// Import other models (Product, Category...)

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const slug = String(query.url || '').replace(/^\//, '') // Remove the / at the beginning

  // 1. Look in the MENU table to see what this URL corresponds to
  // Since your Menu contains a refId and type, this is the best place to look
  const menuItem = await MenuModel.findOne({ url: slug }).lean<Models.IMenu>()
  if (!menuItem) {
    throw createError({ statusCode: 404, message: 'error.noExistURL' })
  }

  // 2. Based on Type and RefId in Menu to get detailed content
  let contentData = null
  const { type, refId } = menuItem
  switch (type) {
    case 'POST':
      contentData = await PostModel.findById(refId).lean<Models.IPost>()
      break
    case 'PAGE':
      contentData = await PostModel.findById(refId).lean<Models.IPost>()
      break
    case 'PRODUCT':
      contentData = await ProductModel.findById(refId).lean<Models.IProduct>()
      break
    case 'CATEGORY':
      contentData = await GroupModel.findById(refId).lean<Models.IGroup>()
      // Add logic to get list of child posts if needed
      break
    default: break
  }

  if (!contentData) {
    throw createError({ statusCode: 404, message: 'error.noExistContent' })
  }

  // 3. Return the standard format for [...slug].vue to display
  return {
    // title: contentData.title || menuItem.title, // Title from menu (or get contentData.title)
    ...contentData, // Merge detailed content into
    type: type, // Let the frontend know which component to select (PostDetail, PageDetail...)
  }
})
