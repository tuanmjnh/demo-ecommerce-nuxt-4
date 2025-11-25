export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'menu-tree', message: 'success', status: true, data: null }

  try {
    const args = getQuery(event)
    const resolved = args.resolved === 'true' // Query param to toggle URL resolution

    // If 'resolved=true', return tree with real URLs, else return raw tree
    if (resolved) {
      rs.data = await MenuService.getResolvedTree()
    } else {
      rs.data = await MenuService.getTree()
    }

    return rs

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'error.serverError',
      message: error.message
    })
  }
})
