import { BillingModel } from '../../models/billing.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'billing-payOrder', message: 'success', status: true, data: null }

  try {
    // const body = await validateBody(event, BillingValidation.statusAction)
    const body = await readBody(event)
    // Allow flexible body structure (direct billing object or nested in table)
    const billingId = body.billing?._id || body.table?.billing?._id
    if (!billingId) throw createError({ statusCode: 400, message: 'Missing Billing ID' })

    const order = await BillingModel.findById(billingId)
    if (!order) throw createError({ statusCode: 404, statusMessage: 'noExist', message: 'Order not found' })

    const updatedInfo = { at: Date.now(), by: event.context.auth?.user?.username, ip: getRequestIP(event) }

    rs.data = await CommonService.update(BillingModel, billingId, {
      $set: { status: 'paid', updated: updatedInfo }
    }, true)

    // Optional: Set Group status to empty here if needed

    if (!rs.data) throw createError({ statusCode: 404, statusMessage: 'noExist', message: 'Update failed' })
    return rs

  } catch (error: any) {
    // if (error.statusCode) throw error
    throw createError({ statusCode: 400, statusMessage: 'error', message: error.message })
  }
})
