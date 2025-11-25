import { UserModel } from '../../models/user.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs = { success: [], error: [], type: 'user-updateFlag', message: 'success', status: true }

  try {
    const { items, flag } = await readBody(event)
    const r = await CommonService.updateFlagByIds(UserModel, items, flag)
    Object.assign(rs, r)
    return rs
  } catch (error: any) {
    throw createError({ statusCode: 400, statusMessage: 'error.updateFailed', message: error.message })
  }
})
