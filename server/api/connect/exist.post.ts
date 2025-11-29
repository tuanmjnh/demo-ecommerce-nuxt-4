import { ConnectModel } from '../../models/connect.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'connect-exist', message: 'success', status: true, data: null }

  try {
    // const query = getQuery(event)
    // const filter = typeof query.filter === 'string' ? JSON.parse(query.filter) : query.filter
    const body = await readBody(event)
    rs.status = await CommonService.exists(ConnectModel, body.filter, body.id ? String(body.id) : undefined)
    return rs

  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error', message: error.message })
  }
})
