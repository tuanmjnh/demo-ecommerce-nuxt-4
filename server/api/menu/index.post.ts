import { MenuModel } from '../../models/menu.model'
// MenuValidation and validateBody are auto-imported

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'menu-create', message: 'success', status: true, data: null }

  try {
    // 1. Validate Body
    // const body = await validateBody(event, MenuValidation.create)
    const body = await readBody(event)
    // 2. Add Meta
    const user = event.context.auth?.user
    const payload = {
      ...body,
      created: { at: Date.now(), by: user?.username, ip: getRequestIP(event) || null }
    }

    // 3. Create
    rs.data = await CommonService.create(MenuModel, payload)

    setResponseStatus(event, 201)
    return rs

  } catch (error: any) {
    // if (error.statusCode) throw error
    throw createError({ statusCode: 400, statusMessage: 'error', message: error.message })
  }
})
