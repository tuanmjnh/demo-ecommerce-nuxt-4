import { ConfigModel } from '../../models/config.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs = { success: [], error: [], type: 'config-updateFlag', message: 'success', status: true }

  try {
    const { items, flag } = await readBody(event)
    const r = await CommonService.updateFlagByIds(ConfigModel, items, flag)
    Object.assign(rs, r)
    return rs
  } catch (error: any) {
    throw createError({ statusCode: 400, statusMessage: 'error', message: error.message })
  }
})
