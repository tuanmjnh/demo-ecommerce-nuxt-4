import { PostModel } from '../../models/post.model'

export default defineEventHandler(async (event) => {
  // No ensureAuth() -> Public route
  const rs: Common.IResponseItems = { type: 'post-getHighlights', message: 'success', status: true, data: null }

  try {
    const args = getQuery(event)
    const filter: any = { $and: [{ isHighlight: true, flag: 1 }] }

    rs.data = await CommonService.findAll(PostModel, filter, {
      page: Number(args.page) || 1,
      limit: Number(args.limit) || 10,
      sort: { sort: 1, createdAt: -1 }
    })
    return rs

  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error.serverError', message: error.message })
  }
})
