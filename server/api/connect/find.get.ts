import { ConnectModel } from '../../models/connect.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'connect-find', message: 'success', status: true, data: null }

  try {
    const query = getQuery(event)

    const item = await CommonService.findOne(ConnectModel, query)
    if (!item) throw new Error('noExist')

    rs.data = item
    return rs

  } catch (error: any) {
    // if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'error', message: error.message })
  }
})
