import { ProductService } from '../../utils/product.service' // or auto-imported

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'product-updateStock', message: 'success', status: true, data: null }

  try {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, message: 'Missing ID' })

    // const body = await validateBody(event, ProductValidation.stock)
    const body = await readBody(event)
    rs.data = await ProductService.updateStock(id, body.stocks)

    return rs

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 400, statusMessage: 'error.updateFailed', message: error.message })
  }
})
