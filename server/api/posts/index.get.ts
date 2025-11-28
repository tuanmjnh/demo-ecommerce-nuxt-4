import { PostModel } from '../../models/post.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItems = { type: 'post-get', message: 'success', status: true, data: null }

  try {
    const args = getQuery(event)
    const filter: any = { $and: [{ flag: args.flag !== undefined ? parseInt(String(args.flag)) : 1 }] }

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

    if (args.key) filter.$and.push({ key: String(args.key) })

    // Handle groups array query
    if (args.groups) {
      const groups = Array.isArray(args.groups) ? args.groups : [args.groups]
      filter.$and.push({ groups: { $in: groups } })
    }

    const sortBy = String(args.sortBy || 'createdAt')
    const sortType = parseInt(String(args.sortType)) || 1

    rs.data = await CommonService.findAll(PostModel, filter, {
      page: Number(args.page) || 1,
      limit: Number(args.limit) || 10,
      sort: { [sortBy]: sortType }
    })

    return rs

  } catch (error: any) {
    // console.error(error)
    throw createError({ statusCode: 500, statusMessage: 'error', message: error.message })
  }
})
