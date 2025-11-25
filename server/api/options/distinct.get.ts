import { OptionsModel } from '../../models/options.model'
import { TMPagination } from 'tm-libs/pagination'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItems = { type: 'options-distinct', message: 'success', status: true, data: null }

  try {
    const args = getQuery(event)
    const items = await CommonService.distinct(OptionsModel, String(args.key), String(args.text || ''))

    if (args.page && args.limit) {
      rs.data = TMPagination(items, parseInt(String(args.page)), parseInt(String(args.limit)))
    } else {
      rs.data = { items: items, total: items.length }
    }

    return rs

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'error.serverError',
      message: error.message
    })
  }
})
