import { GroupModel } from '../../models/group.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'group-exist', message: 'success', status: true, data: null }

  try {
    const query = getQuery(event)
    const data = typeof query.args === 'string' ? JSON.parse(query.args) : query.args

    rs.status = await CommonService.exists(GroupModel, data.filter, String(data.id))

    return rs
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'error.serverError',
      message: error.message
    })
  }
})
