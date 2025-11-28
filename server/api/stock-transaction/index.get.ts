import { ModelStockTransaction } from '../../models/stock-transaction.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  try {
    const args = getQuery(event)
    const filter: any = {}

    if (args.productId) filter.productId = args.productId
    if (args.warehouseId) filter.warehouseId = args.warehouseId
    if (args.type) filter.type = args.type

    const rs = await CommonService.findAll(ModelStockTransaction, filter, {
      page: Number(args.page) || 1,
      limit: Number(args.limit) || 20,
      sort: { createdAt: -1 }
    })

    return { type: 'transaction-get', status: true, message: 'success', ...rs }
  } catch (e: any) {
    throw createError({ statusCode: 500, statusMessage: 'error', message: e.message })
  }
})
