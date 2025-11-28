import { ProductModel } from '../../models/product.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'product-findById', message: 'success', status: true, data: null }

  try {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, message: 'Missing ID' })

    const item = await CommonService.findById(ProductModel, id)
    if (!item) throw createError({ statusCode: 404, statusMessage: 'noExist', message: 'Product not found' })

    rs.data = item
    return rs

  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error', message: error.message })
  }
})
