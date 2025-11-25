import { ConfigModel } from '../../models/config.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'config-update', message: 'success', status: true, data: null }

  try {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, message: 'Missing ID' })

    // const data = await validateBody(event, ConfigValidation.update)
    const body = await readBody(event)
    if (body.code) {
      const exist = await CommonService.checkExist(ConfigModel, 'code', body.code.toLowerCase(), id)
      if (exist) {
        throw createError({ statusCode: 400, statusMessage: 'error.exists', message: 'Code already exists' })
      }
    }

    const clientIP = getRequestIP(event)
    const user = event.context.auth?.user
    const payload = {
      ...body,
      updated: { at: Date.now(), by: user?.username, ip: clientIP }
    }

    rs.data = await CommonService.update(ConfigModel, id, payload)
    if (!rs.data) throw createError({ statusCode: 404, statusMessage: 'error.noExist', message: 'Config not found' })

    return rs

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 400, statusMessage: 'error.updateFailed', message: error.message })
  }
})
