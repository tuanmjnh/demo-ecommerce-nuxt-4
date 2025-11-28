import { ConnectModel } from '../../models/connect.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItems = { type: 'connect-get', message: 'success', status: true, data: null }

  try {
    const query = getQuery(event)

    // 1. Build Filter
    const filter: any = {
      $and: [{ flag: query.flag !== undefined ? parseInt(String(query.flag)) : 1 }]
    }

    if (query.text) {
      const textRegex = new RegExp(String(query.text), 'i')
      filter.$and.push({
        $or: [
          { key: textRegex },
          { code: textRegex },
          { value: textRegex },
          { title: textRegex },
        ]
      })
    }

    // 2. Sort & Pagination
    const sortBy = String(query.sortBy || 'sort')
    const sortType = parseInt(String(query.sortType)) || 1
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10

    // 3. Query
    rs.data = await CommonService.findAll(ConnectModel, filter, {
      page,
      limit,
      sort: { [sortBy]: sortType }
    })

    return rs

  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error', message: error.message })
  }
})
