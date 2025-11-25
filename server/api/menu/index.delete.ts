import { MenuModel } from '../../models/menu.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs = { success: [], error: [], type: 'menu-delete', message: 'success', status: true }

  try {
    const body = await readBody(event)
    // Handle both { items: [] } (standard) and { ids: [] } (from your old controller)
    const ids = body.items || body.ids

    if (!Array.isArray(ids) || ids.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'error.missingIds', message: 'No items selected' })
    }

    const r = await CommonService.deleteByIds(MenuModel, ids)
    Object.assign(rs, r)
    return rs

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 400, statusMessage: 'error.deleteFailed', message: error.message })
  }
})
