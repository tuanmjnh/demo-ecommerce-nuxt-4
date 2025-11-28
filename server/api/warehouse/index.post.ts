import { WarehouseModel } from '../../models/warehouse.model'
// WarehouseValidation and validateBody are auto-imported

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'warehouse-create', message: 'success', status: true, data: null }

  try {
    // const body = await validateBody(event, WarehouseValidation.create)
    const body = await readBody(event)
    // Check duplicate code
    if (body.code) {
      const exist = await CommonService.checkExist(WarehouseModel, 'code', body.code)
      if (exist) {
        throw createError({ statusCode: 400, statusMessage: 'exists', message: 'Warehouse code already exists' })
      }
    }

    const clientIP = getRequestIP(event) || null
    const user = event.context.auth?.user
    const payload = {
      ...body,
      created: { at: Date.now(), by: user?.username, ip: clientIP }
    }

    rs.data = await CommonService.create(WarehouseModel, payload)

    setResponseStatus(event, 201)
    return rs

  } catch (error: any) {
    throw createError({ statusCode: 400, statusMessage: 'error', message: error.message })
  }
})
