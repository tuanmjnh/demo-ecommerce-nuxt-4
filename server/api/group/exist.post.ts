import { GroupModel } from '../../models/group.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'group-exist', message: 'success', status: true, data: null }

  try {
    // const query = getQuery(event)
    // const data = typeof query.args === 'string' ? JSON.parse(query.args) : query.args
    const body = await readBody(event)
    rs.status = await CommonService.exists(GroupModel, body.filter, body.id ? String(body.id) : undefined)
    // console.log(rs)
    return rs
  } catch (error: any) {
    console.log(error)
    throw createError({ statusCode: 500, statusMessage: 'error', message: error.message })
  }
})
