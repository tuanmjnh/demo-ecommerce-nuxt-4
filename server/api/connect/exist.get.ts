import { ConnectModel } from '../../models/connect.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'connect-exist', message: 'success', status: true, data: null }

  try {
    const query = getQuery(event)

    // Ensure filter is parsed correctly if sent as JSON string
    const filter = typeof query.filter === 'string' ? JSON.parse(query.filter) : query.filter

    rs.status = await CommonService.exists(ConnectModel, filter, String(query.id))
    return rs

  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error.serverError', message: error.message })
  }
})
