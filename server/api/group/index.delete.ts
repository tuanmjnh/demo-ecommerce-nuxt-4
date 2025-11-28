import { GroupModel } from '../../models/group.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs = { success: [], error: [], type: 'group-delete', message: 'success', status: true }

  try {
    const { items } = await readBody(event)

    const r = await CommonService.deleteByIds(GroupModel, items)

    Object.assign(rs, r)

    return rs
  } catch (error: any) {
    throw createError({ statusCode: 400, statusMessage: 'error', message: error.message })
  }
})
