import { ConnectModel } from '../../models/connect.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'connect-create', message: 'success', status: true, data: null }

  try {
    const body = await readBody(event)

    // Check if code exists (unique)
    if (body.code) {
      const exist = await CommonService.checkExist(ConnectModel, 'code', body.code.toUpperCase())
      if (exist) throw new Error('exist')
      body.code = body.code.toUpperCase()
    }

    const user = event.context.auth?.user
    body.created = { at: Date.now(), by: user?.username, ip: getRequestIP(event) }

    rs.data = await CommonService.create(ConnectModel, body)

    setResponseStatus(event, 201)
    return rs

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 400, statusMessage: 'error.createFailed', message: error.message })
  }
})
