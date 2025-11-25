import { BillingModel } from '../../models/billing.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'billing-removeOrderItem', message: 'success', status: true, data: null }

  try {
    // const body = await validateBody(event, BillingValidation.itemAction)
    const body = await readBody(event)
    if (!body.productId) throw new Error('Missing Product ID')

    const order = await BillingModel.findById(body.id)
    if (!order) throw createError({ statusCode: 404, statusMessage: 'error.noExist', message: 'Order not found' })
    if (order.status !== 'serving') throw createError({ statusCode: 400, statusMessage: 'error.noServing', message: 'Order is not serving' })

    const target = order.items.find(i => i.productId === body.productId)
    if (!target) throw createError({ statusCode: 404, statusMessage: 'error.noItem', message: 'Item not found' })

    const items = order.items.filter(i => i.productId !== body.productId)

    const updatedInfo = { at: Date.now(), by: event.context.auth?.user?.username, ip: getRequestIP(event) }

    rs.data = await CommonService.update(BillingModel, body.id, {
      $set: { items: items, total: calculateBillingTotal(items), updated: updatedInfo },
      $push: { history: { action: 'remove', item: target, reason: body.reason || null, updated: updatedInfo } }
    }, true)

    return rs

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 400, statusMessage: 'error.actionFailed', message: error.message })
  }
})
