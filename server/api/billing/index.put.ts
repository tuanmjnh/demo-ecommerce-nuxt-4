import { BillingModel } from '../../models/billing.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'billing-update', message: 'success', status: true, data: null }

  try {
    // Validate using the update schema which expects { table, items, reason }
    // const body = await validateBody(event, BillingValidation.update)
    const body = await readBody(event)
    const billingId = body.table.billing._id

    // 1. Check exist
    const order = await BillingModel.findById(billingId)
    if (!order) throw createError({ statusCode: 404, statusMessage: 'noExist', message: 'Order not found' })

    // 2. Update
    const updatedInfo = { at: Date.now(), by: event.context.auth?.user?.username, ip: getRequestIP(event) }
    const total = calculateBillingTotal(body.items)

    rs.data = await CommonService.update(BillingModel, billingId, {
      $set: { items: body.items, total: total, updated: updatedInfo },
      $push: {
        history: {
          action: 'update',
          items: body.table.billing.items, // Old items snapshot
          reason: body.reason,
          updated: updatedInfo
        }
      }
    }, true)

    if (!rs.data) throw createError({ statusCode: 404, statusMessage: 'noExist', message: 'Failed to update' })

    return rs

  } catch (error: any) {
    // if (error.statusCode) throw error
    throw createError({ statusCode: 400, statusMessage: 'error', message: error.message })
  }
})
