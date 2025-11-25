import { WarehouseModel } from '../../models/warehouse.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'warehouse-find', message: 'success', status: true, data: null }

  try {
    const args = getQuery(event)
    rs.data = await CommonService.findOne(WarehouseModel, args)
    if (!rs.data) throw createError({ statusCode: 404, statusMessage: 'error.noExist', message: 'Warehouse not found' })
    return rs
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'error.serverError', message: error.message })
  }
})
