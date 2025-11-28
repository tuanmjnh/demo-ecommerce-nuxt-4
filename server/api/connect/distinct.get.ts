import { ConnectModel } from '../../models/connect.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItems = { type: 'connect-distinct', message: 'success', status: true, data: null }

  try {
    const { key, text, page, limit } = getQuery(event)

    const items = await CommonService.distinct(ConnectModel, String(key), String(text || ''))

    // Pagination logic (if needed manually or via helper)
    if (page && limit) {
      const p = parseInt(String(page))
      const l = parseInt(String(limit))
      const start = (p - 1) * l
      rs.data = {
        items: items.slice(start, start + l),
        total: items.length,
        page: p,
        limit: l
      }
    } else {
      rs.data = { items: items, total: items.length }
    }

    return rs
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error', message: error.message })
  }
})
