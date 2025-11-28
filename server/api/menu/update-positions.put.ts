// MenuValidation is auto-imported

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'menu-updatePositions', message: 'success', status: true, data: null }

  try {
    // 1. Validate Body (Must be an array of objects)
    // const items = await validateBody(event, MenuValidation.updatePositions)
    const items = await readBody(event)
    // 2. Execute Bulk Update via Service
    const success = await MenuService.updatePositions(items)

    if (!success && items.length > 0) {
      // Could mean no documents matched or nothing modified
      // But usually we just return success if no hard error occurred
    }

    rs.data = true
    return rs

  } catch (error: any) {
    throw createError({ statusCode: 400, statusMessage: 'error', message: error.message })
  }
})
