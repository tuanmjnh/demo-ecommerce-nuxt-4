import { ConnectModel } from '../../models/connect.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'connect-update', message: 'success', status: true, data: null }

  try {
    const id = getRouterParam(event, 'id')
    if (!id) throw new Error('missingId')

    const body = await readBody(event)

    // Check if code exists (unique)
    if (body.code) {
      const exist = await CommonService.checkExist(ConnectModel, 'code', body.code.toUpperCase(), id)
      if (exist) throw new Error('exist')
      body.code = body.code.toUpperCase()
    }

    const user = event.context.auth?.user
    body.updated = { at: Date.now(), by: user?.username, ip: getRequestIP(event) }

    rs.data = await CommonService.update(ConnectModel, id, body)

    if (!rs.data) throw new Error('noExist')
    return rs

  } catch (error: any) {
    // if (error.statusCode) throw error
    throw createError({ statusCode: 400, statusMessage: 'error', message: error.message })
  }
})
