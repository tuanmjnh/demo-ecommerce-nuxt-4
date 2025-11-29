import { RouteModel } from '../../models/route.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'route-exist', message: 'success', status: true, data: null }

  try {
    // const args = getQuery(event)
    // const filter = typeof args.filter === 'string' ? JSON.parse(args.filter) : args.filter
    const body = await readBody(event)
    rs.status = await CommonService.exists(RouteModel, body.filter, body.id ? String(body.id) : undefined)
    return rs
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error', message: error.message })
  }
})
