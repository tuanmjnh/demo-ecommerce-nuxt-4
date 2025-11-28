import { ConnectModel } from '../../models/connect.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'connect-findById', message: 'success', status: true, data: null }

  try {
    const id = getRouterParam(event, 'id')
    if (!id) throw new Error('missingId')

    const item = await CommonService.findById(ConnectModel, id)
    if (!item) throw new Error('noExist')

    rs.data = item
    return rs

  } catch (error: any) {
    // if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'serverError', message: error.message })
  }
})
