import { RoleModel } from '../../models/role.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs = { success: [], error: [], type: 'role-updateFlag', message: 'success', status: true }

  try {
    const { items, flag } = await readBody(event)
    const r = await CommonService.updateFlagByIds(RoleModel, items, flag)
    Object.assign(rs, r)
    return rs
  } catch (error: any) {
    throw createError({ statusCode: 400, statusMessage: 'error.updateFailed', message: error.message })
  }
})
