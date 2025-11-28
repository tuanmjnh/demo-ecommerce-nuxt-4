import { BillingModel } from '../../models/billing.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'billing-updateOrderItem', message: 'success', status: true, data: null }

  try {
    // const body = await validateBody(event, BillingValidation.itemAction)
    const body = await readBody(event)
    if (!body.newItem || !body.oldItem) throw new Error('Missing item data')

    const order = await BillingModel.findById(body.id)
    if (!order) throw createError({ statusCode: 404, statusMessage: 'noExist', message: 'Order not found' })
    if (order.status !== 'serving') throw createError({ statusCode: 400, statusMessage: 'noServing', message: 'Order is not serving' })
    if (Number(body.newItem.quantity) <= 0) throw createError({ statusCode: 400, statusMessage: 'invalidQuantity', message: 'Invalid quantity' })

    const items = [...order.items]
    const targetIndex = items.findIndex(i => i.productId === body.oldItem!.productId)

    if (targetIndex < 0) throw createError({ statusCode: 404, statusMessage: 'noItem', message: 'Item not found in order' })

    // Replace item
    if (items && items.length && items[targetIndex] && body.newItem && body.newItem.productId && body.newItem.productId !== body.oldItem.productId) {
      items[targetIndex].productId = body.newItem.productId
      items[targetIndex].name = body.newItem.name
      items[targetIndex].quantity = body.newItem.quantity
      items[targetIndex].price = body.newItem.price
    }

    const updatedInfo = { at: Date.now(), by: event.context.auth?.user?.username, ip: getRequestIP(event) }

    rs.data = await CommonService.update(BillingModel, body.id, {
      $set: { items: items, total: calculateBillingTotal(items), updated: updatedInfo },
      $push: { history: { action: 'update', item: body.newItem, updated: updatedInfo } }
    }, true)

    return rs

  } catch (error: any) {
    // if (error.statusCode) throw error
    throw createError({ statusCode: 400, statusMessage: 'error', message: error.message })
  }
})
