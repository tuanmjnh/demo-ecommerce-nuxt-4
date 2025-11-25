import { PostModel } from '../../../models/post.model'

export default defineEventHandler(async (event) => {
  const rs: Common.IResponseItems = { type: 'post-getRelated', message: 'success', status: true, data: null }

  try {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, message: 'Missing ID' })

    const args = getQuery(event)

    const item = await PostModel.findById(id)
    if (!item) throw createError({ statusCode: 404, statusMessage: 'error.noExist', message: 'Post not found' })

    const filter = {
      _id: { $ne: id },
      flag: 1,
      $or: [
        { tags: { $in: item.tags || [] } },
        { groups: { $in: item.groups || [] } },
      ]
    }

    rs.data = await CommonService.findAll(PostModel, filter, {
      page: Number(args.page) || 1,
      limit: Number(args.limit) || 10,
    })
    return rs

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'error.serverError', message: error.message })
  }
})
