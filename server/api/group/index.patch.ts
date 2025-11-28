import { GroupModel } from '../../models/group.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs = { success: [], error: [], type: 'group-updateFlag', message: 'success', status: true }

  try {
    const { items, flag } = await readBody(event)

    const r = await CommonService.updateFlagByIds(GroupModel, items, flag)

    // Merge results
    Object.assign(rs, r)

    return rs
  } catch (error: any) {
    throw createError({ statusCode: 400, statusMessage: 'error', message: error.message })
  }
})
