import { RoleModel } from '../../models/role.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'role-exist', message: 'success', status: true, data: null }

  try {
    // const args = getQuery(event)
    // const filter = typeof args.filter === 'string' ? JSON.parse(args.filter) : args.filter
    const body = await readBody(event)
    rs.status = await CommonService.exists(RoleModel, body.filter, String(body.id))
    return rs
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error', message: error.message })
  }
})
