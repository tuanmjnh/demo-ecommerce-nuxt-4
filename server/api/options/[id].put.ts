import { OptionsModel } from '../../models/options.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'options-update', message: 'success', status: true, data: null }

  try {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, statusMessage: 'noExist', message: 'Missing ID' })

    // 1. Validate Body
    // const data = await validateBody(event, OptionsValidation.update)
    const body = await readBody(event)
    // 2. Check duplicate (key + code) if they are being updated
    if (body.code && body.key) {
      // Check existing records excluding current ID
      const exist = await CommonService.exists(OptionsModel, { key: body.key, code: body.code }, id)
      if (exist) {
        throw createError({
          statusCode: 400,
          statusMessage: 'exists',
          message: 'Key and Code combination already exists'
        })
      }
    }

    // 3. Add Meta Data
    const user = event.context.auth?.user
    const payload = {
      ...body,
      updated: { at: Date.now(), by: user?.username, ip: getRequestIP(event) }
    }

    // 4. Update DB
    rs.data = await CommonService.update(OptionsModel, id, payload)

    if (!rs.data) {
      throw createError({ statusCode: 404, statusMessage: 'noExist', message: 'Record not found' })
    }

    return rs

  } catch (error: any) {
    throw createError({ statusCode: 400, statusMessage: 'error', message: error.message })
  }
})
