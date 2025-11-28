import { WarehouseModel } from '../../models/warehouse.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'warehouse-update', message: 'success', status: true, data: null }

  try {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, statusMessage: 'noExist', message: 'Missing ID' })

    // const body = await validateBody(event, WarehouseValidation.update)
    const body = await readBody(event)
    // Check duplicate code if provided
    if (body.code) {
      const exist = await CommonService.checkExist(WarehouseModel, 'code', body.code, id)
      if (exist) {
        throw createError({ statusCode: 400, statusMessage: 'exists', message: 'Warehouse code already exists' })
      }
    }

    const clientIP = getRequestIP(event)
    const user = event.context.auth?.user
    const payload = {
      ...body,
      updated: { at: Date.now(), by: user?.username, ip: clientIP }
    }

    rs.data = await CommonService.update(WarehouseModel, id, payload)

    if (!rs.data) throw createError({ statusCode: 404, statusMessage: 'noExist', message: 'Warehouse not found' })

    return rs

  } catch (error: any) {
    throw createError({ statusCode: 400, statusMessage: 'error', message: error.message })
  }
})
