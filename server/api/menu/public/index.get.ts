import { MenuModel } from '../../../models/menu.model'

export default defineEventHandler(async (event) => {
  const rs: Common.IResponseItems = { type: 'public-get', message: 'success', status: true, data: null }
  try {
    const args = getQuery(event)
    const filter: any = { flag: args.flag !== undefined ? parseInt(String(args.flag)) : 1 }

    rs.data = await CommonService.findAll(MenuModel, filter, { sort: { sort: 1 } })
    rs.data = rs.data.items
    return rs

  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error', message: error.message })
  }
})
