import { BillingModel } from '../../models/billing.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'billing-addItemToOrder', message: 'success', status: true, data: null }

  try {
    // const body = await validateBody(event, BillingValidation.itemAction)
    const body = await readBody(event)
    if (!body.item) throw new Error('Missing item data')

    const order = await BillingModel.findById(body.id)
    if (!order) throw createError({ statusCode: 404, statusMessage: 'error.noExist', message: 'Order not found' })
    if (order.status !== 'serving') throw createError({ statusCode: 400, statusMessage: 'error.noServing', message: 'Order is not serving' })

    if (Number(body.item.quantity) <= 0) throw createError({ statusCode: 400, statusMessage: 'error.invalidQuantity', message: 'Invalid quantity' })

    // Logic: Clone items -> find -> add/push
    const items = [...order.items]
    const existing = items.find(i => i.productId === body.item!.productId)

    if (existing) {
      existing.quantity += body.item.quantity
    } else {
      items.push(body.item)
    }

    const updatedInfo = { at: Date.now(), by: event.context.auth?.user?.username, ip: getRequestIP(event) }

    rs.data = await CommonService.update(BillingModel, body.id, {
      $set: { items: items, total: calculateBillingTotal(items), updated: updatedInfo },
      $push: { history: { action: 'add', item: body.item, updated: updatedInfo } }
    }, true)

    if (!rs.data) throw createError({ statusCode: 404, statusMessage: 'error.noExist', message: 'Update failed' })
    return rs

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 400, statusMessage: 'error.actionFailed', message: error.message })
  }
})
