import { RoleModel } from '../../models/role.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'role-find', message: 'success', status: true, data: null }

  try {
    const args = getQuery(event)
    rs.data = await CommonService.findOne(RoleModel, args)
    if (!rs.data) throw createError({ statusCode: 404, statusMessage: 'noExist', message: 'Role not found' })
    return rs
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error', message: error.message })
  }
})
