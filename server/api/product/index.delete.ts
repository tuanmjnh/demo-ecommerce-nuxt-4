import { ProductModel } from '../../models/product.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs = { success: [], error: [], type: 'product-delete', message: 'success', status: true }

  try {
    const { items } = await readBody(event)

    const r = await CommonService.deleteByIds(ProductModel, items)
    Object.assign(rs, r)

    return rs

  } catch (error: any) {
    throw createError({ statusCode: 400, statusMessage: 'error.deleteFailed', message: error.message })
  }
})
