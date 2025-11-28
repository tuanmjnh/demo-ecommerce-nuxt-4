import { ProductModel } from '../../models/product.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'product-find', message: 'success', status: true, data: null }

  try {
    const args = getQuery(event)
    rs.data = await CommonService.findOne(ProductModel, args)
    if (!rs.data) throw createError({ statusCode: 404, statusMessage: 'noExist', message: 'Product not found' })
    return rs
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error', message: error.message })
  }
})
