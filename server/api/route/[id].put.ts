import { RouteModel } from '../../models/route.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'route-update', message: 'success', status: true, data: null }

  try {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, message: 'Missing ID' })

    // const data = await validateBody(event, RouteValidation.update)
    const body = await readBody(event)
    if (body.code) {
      const exist = await CommonService.checkExist(RouteModel, 'name', body.name!.toLowerCase(), id)
      if (exist) {
        throw createError({ statusCode: 400, statusMessage: 'error.exists', message: 'Name already exists' })
      }
    }

    const user = event.context.auth?.user
    const payload = {
      ...body,
      updated: { at: Date.now(), by: user?.username, ip: getRequestIP(event) }
    }

    rs.data = await CommonService.update(RouteModel, id, payload)
    if (!rs.data) throw createError({ statusCode: 404, statusMessage: 'error.noExist', message: 'Route not found' })

    return rs

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 400, statusMessage: 'error.updateFailed', message: error.message })
  }
})
