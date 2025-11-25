import { PostModel } from '../../../models/post.model'

export default defineEventHandler(async (event) => {
  const rs: Common.IResponseItems = { type: 'post-getByTag', message: 'success', status: true, data: null }

  try {
    const tag = getRouterParam(event, 'tag')
    const args = getQuery(event)

    const filter: any = { $and: [{ tags: tag, flag: 1 }] }

    rs.data = await CommonService.findAll(PostModel, filter, {
      page: Number(args.page) || 1,
      limit: Number(args.limit) || 10,
      sort: { createdAt: -1 }
    })
    return rs

  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error.serverError', message: error.message })
  }
})
