import { OptionsModel } from '../../models/options.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItems = { type: 'options-get', message: 'success', status: true, data: null }

  try {
    const args = getQuery(event)
    const filter: any = { $and: [{ flag: args.flag !== undefined ? parseInt(String(args.flag)) : 1 }] }

    // Search text in key, code, title
    if (args.text) {
      const text = String(args.text)
      filter.$and.push({
        $or: [
          { key: new RegExp(text, 'i') },
          { code: new RegExp(text, 'i') },
          { title: new RegExp(text, 'i') },
        ]
      })
    }

    // Filter by specific key
    if (args.key) {
      filter.$and.push({ key: String(args.key) })
    }

    const sortBy = String(args.sortBy || 'sort')
    const sortType = parseInt(String(args.sortType)) || 1

    rs.data = await CommonService.findAll(OptionsModel, filter, {
      page: Number(args.page) || 1,
      limit: Number(args.limit) || 10,
      sort: { [sortBy]: sortType }
    })

    return rs

  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error', message: error.message })
  }
})
