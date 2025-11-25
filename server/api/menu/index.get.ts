import { MenuModel } from '../../models/menu.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItems = { type: 'menu-get', message: 'success', status: true, data: null }

  try {
    const args = getQuery(event)
    const filter: any = { $and: [] }

    // Default flag filter
    filter.$and.push({
      flag: args.flag !== undefined ? parseInt(String(args.flag)) : 1
    })

    // Search text
    if (args.text) {
      const textRegex = new RegExp(String(args.text), 'i')
      filter.$and.push({
        $or: [
          { title: textRegex },
          // { key: textRegex } // 'key' doesn't exist in your schema, check if needed
        ]
      })
    }

    // Filter by Key if schema supported it (removed based on your provided schema)
    // if (args.key) filter.$and.push({ key: String(args.key) })

    const sortBy = String(args.sortBy || 'sort')
    const sortType = parseInt(String(args.sortType)) || 1

    rs.data = await CommonService.findAll(MenuModel, filter, {
      page: Number(args.page) || 1,
      limit: Number(args.limit) || 10,
      sort: { [sortBy]: sortType }
    })

    return rs

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'error.serverError',
      message: error.message
    })
  }
})
