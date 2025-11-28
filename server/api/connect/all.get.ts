import { ConnectModel } from '../../models/connect.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItems = { type: 'connect-getAll', message: 'success', status: true, data: null }

  try {
    const query = getQuery(event)

    const filter: any = {
      $and: [{ flag: query.flag !== undefined ? parseInt(String(query.flag)) : 1 }]
    }

    const sortBy = String(query.sortBy || 'sort')
    const sortType = parseInt(String(query.sortType)) || 1

    rs.data = await CommonService.findAll(ConnectModel, filter, {
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 0, // 0 means no limit
      sort: { [sortBy]: sortType }
    })

    return rs

  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error', message: error.message })
  }
})
