import { BillingModel } from '../../models/billing.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'billing-find', message: 'success', status: true, data: null }
  try {
    const args = getQuery(event)
    rs.data = await CommonService.findOne(BillingModel, args)
    if (!rs.data) throw createError({ statusCode: 404, statusMessage: 'noExist', message: 'Order not found' })
    return rs
  } catch (error: any) {
    // if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'serverError', message: error.message })
  }
})
