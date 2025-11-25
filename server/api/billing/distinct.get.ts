import { BillingModel } from '../../models/billing.model'
import { TMPagination } from 'tm-libs/pagination'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItems = { type: 'billing-distinct', message: 'success', status: true, data: null }
  try {
    const args = getQuery(event)
    const items = await CommonService.distinct(BillingModel, String(args.key), String(args.text || ''))
    if (args.page && args.limit) {
      rs.data = TMPagination(items, parseInt(String(args.page)), parseInt(String(args.limit)))
    } else {
      rs.data = { items: items, total: items.length }
    }
    return rs
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error.serverError', message: error.message })
  }
})
