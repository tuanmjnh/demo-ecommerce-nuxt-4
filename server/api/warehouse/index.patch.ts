import { WarehouseModel } from '../../models/warehouse.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs = { success: [], error: [], type: 'warehouse-updateFlag', message: 'success', status: true }

  try {
    const { items, flag } = await readBody(event)
    const r = await CommonService.updateFlagByIds(WarehouseModel, items, flag)
    Object.assign(rs, r)
    return rs
  } catch (error: any) {
    throw createError({ statusCode: 400, statusMessage: 'error', message: error.message })
  }
})
