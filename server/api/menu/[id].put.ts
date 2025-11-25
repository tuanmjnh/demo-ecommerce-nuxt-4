import { MenuModel } from '../../models/menu.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'menu-update', message: 'success', status: true, data: null }

  try {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, statusMessage: 'error.missingId', message: 'Missing ID' })

    // 1. Validate Body
    // const body = await validateBody(event, MenuValidation.update)
    const body = await readBody(event)
    // 2. Add Meta
    const user = event.context.auth?.user
    const payload = {
      ...body,
      updated: { at: Date.now(), by: user?.username, ip: getRequestIP(event) }
    }

    // 3. Update
    rs.data = await CommonService.update(MenuModel, id, payload)

    if (!rs.data) throw createError({ statusCode: 404, statusMessage: 'error.noExist', message: 'Record not found' })

    return rs

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 400,
      statusMessage: 'error.updateFailed',
      message: error.message
    })
  }
})
