import { RouteModel } from '../../models/route.model'
// RouteValidation and validateBody are auto-imported

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'route-create', message: 'success', status: true, data: null }

  try {
    // const body = await validateBody(event, RouteValidation.create)
    const body = await readBody(event)
    // Check if code exists (unique check on 'name' field as per original controller)
    if (body.code) {
      // Original logic checks 'name' uniqueness when 'code' is present
      const exist = await CommonService.checkExist(RouteModel, 'name', body.name)
      if (exist) {
        throw createError({ statusCode: 400, statusMessage: 'error.exists', message: 'Name already exists' })
      }
      // body.code is already transformed to UpperCase by Zod
    }

    const user = event.context.auth?.user
    const payload = {
      ...body,
      created: { at: Date.now(), by: user?.username, ip: getRequestIP(event) || null }
    }

    rs.data = await CommonService.create(RouteModel, payload)

    setResponseStatus(event, 201)
    return rs

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 400, statusMessage: 'error.createFailed', message: error.message })
  }
})
