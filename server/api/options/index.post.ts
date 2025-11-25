import { OptionsModel } from '../../models/options.model'
// OptionsValidation and validateBody are auto-imported

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'options-create', message: 'success', status: true, data: null }

  try {
    // 1. Validate Body
    // const data = await validateBody(event, OptionsValidation.create)
    const body = await readBody(event)
    // 2. Check duplicate (key + code)
    if (body.code && body.key) {
      const exist = await CommonService.exists(OptionsModel, { key: body.key, code: body.code })
      if (exist) {
        throw createError({
          statusCode: 400,
          statusMessage: 'error.exists',
          message: 'Key and Code combination already exists'
        })
      }
    }

    // 3. Add Meta Data
    const user = event.context.auth?.user
    const payload = {
      ...body,
      created: { at: Date.now(), by: user?.username, ip: getRequestIP(event) || null }
    }

    // 4. Save
    rs.data = await CommonService.create(OptionsModel, payload)

    setResponseStatus(event, 201)
    return rs

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 400,
      statusMessage: 'error.createFailed',
      message: error.message
    })
  }
})
