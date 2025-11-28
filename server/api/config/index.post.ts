import { ConfigModel } from '../../models/config.model'
// ConfigValidation and validateBody are auto-imported

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'config-create', message: 'success', status: true, data: null }

  try {
    // 1. Validate
    // const data = await validateBody(event, ConfigValidation.create)
    const body = await readBody(event)
    // 2. Check duplicate
    if (body.code) {
      const exist = await CommonService.checkExist(ConfigModel, 'code', body.code.toLowerCase())
      if (exist) {
        throw createError({ statusCode: 400, statusMessage: 'exists', message: 'Code already exists' })
      }
    }

    // 3. Meta
    const user = event.context.auth?.user
    const payload = {
      ...body,
      created: { at: Date.now(), by: user?.username, ip: getRequestIP(event) || null }
    }

    // 4. Save
    rs.data = await CommonService.create(ConfigModel, payload)

    setResponseStatus(event, 201)
    return rs

  } catch (error: any) {
    // if (error.statusCode) throw error
    throw createError({ statusCode: 400, statusMessage: 'error', message: error.message })
  }
})
