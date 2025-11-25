import { StockService } from '../../utils/stock.service'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  try {
    // const data = await validateBody(event, EcommerceValidation.transaction.create)
    const body = await readBody(event)
    const user = event.context.auth?.user
    const clientIP = getRequestIP(event)

    const result = await StockService.performTransaction({
      ...body,
      user,
      ip: clientIP
    })

    return {
      type: 'inventory-action',
      status: true,
      message: 'Transaction successful',
      data: result
    }

  } catch (e: any) {
    if (e.statusCode) throw e
    throw createError({ statusCode: 400, message: e.message })
  }
})
