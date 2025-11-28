import { MenuModel } from '../../models/menu.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'menu-findById', message: 'success', status: true, data: null }

  try {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, statusMessage: 'missingId', message: 'Missing ID' })

    const item = await CommonService.findById(MenuModel, id)
    if (!item) throw createError({ statusCode: 404, statusMessage: 'noExist', message: 'Record not found' })

    rs.data = item
    return rs
  } catch (error: any) {
    // if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'error', message: error.message })
  }
})
