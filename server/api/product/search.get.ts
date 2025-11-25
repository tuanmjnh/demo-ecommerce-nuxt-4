import { ProductModel } from '../../models/product.model'
import { TMPagination } from 'tm-libs/pagination'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'product-search', message: 'success', status: true, data: null }

  try {
    const { text, page, limit } = getQuery(event)

    if (!text) {
      throw createError({ statusCode: 400, message: 'Missing search text' })
    }

    const items = await CommonService.search(ProductModel, String(text))

    if (page && limit) {
      rs.data = TMPagination(items, parseInt(String(page)), parseInt(String(limit)))
    } else {
      rs.data = { items: items, total: items.length }
    }

    return rs

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'error.serverError', message: error.message })
  }
})
