import { GroupModel } from '../../../models/group.model'

export default defineEventHandler(async (event) => {
  const rs: Common.IResponseItems = { type: 'public-get', message: 'success', status: true, data: null }
  try {
    const args = getQuery(event)
    const filter: any = { $and: [{ flag: args.flag !== undefined ? parseInt(String(args.flag)) : 1 }] }
    // Filter by text
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
    // Filter by key
    if (args.key) {
      filter.$and.push({ key: String(args.key) })
    }
    rs.data = await CommonService.findAll(GroupModel, filter, { sort: { sort: 1 } })
    rs.data = rs.data.items
    return rs

  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'serverError', message: error.message })
  }
})
