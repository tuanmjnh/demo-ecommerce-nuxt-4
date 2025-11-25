import { ModelStock } from '../../models/stock.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  try {
    const args = getQuery(event)
    const filter: any = {}

    if (args.productId) filter.productId = args.productId
    if (args.warehouseId) filter.warehouseId = args.warehouseId
    if (args.sku) filter.sku = new RegExp(String(args.sku), 'i')

    // Support populate to get product name, warehouse name
    // Assuming CommonService supports basic find, for populate we might need custom logic or Mongoose middleware
    const rs = await CommonService.findAll(ModelStock, filter, {
      page: Number(args.page) || 1,
      limit: Number(args.limit) || 20,
      sort: { updatedAt: -1 }
    })

    return { type: 'stock-get', status: true, message: 'success', ...rs }
  } catch (e: any) {
    throw createError({ statusCode: 500, message: e.message })
  }
})
