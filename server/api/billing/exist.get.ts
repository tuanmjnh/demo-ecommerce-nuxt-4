import { BillingModel } from '../../models/billing.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'billing-exist', message: 'success', status: true, data: null }
  try {
    const args = getQuery(event)
    const filter = typeof args.filter === 'string' ? JSON.parse(args.filter) : args.filter
    rs.status = await CommonService.exists(BillingModel, filter as any, String(args.id))
    return rs
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error.serverError', message: error.message })
  }
})
