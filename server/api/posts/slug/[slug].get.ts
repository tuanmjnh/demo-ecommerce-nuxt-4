import { PostModel } from '../../../models/post.model'

export default defineEventHandler(async (event) => {
  // No ensureAuth -> Public route
  const rs: Common.IResponseItem = { type: 'post-getBySlug', message: 'success', status: true, data: null }

  try {
    const slug = getRouterParam(event, 'slug')
    if (!slug) throw createError({ statusCode: 400, statusMessage: 'error.missingSlug', message: 'Missing Slug' })

    // Find active post
    const item = await PostModel.findOne({ slug, flag: 1 })
    if (!item) throw createError({ statusCode: 404, statusMessage: 'error.noExist', message: 'Post not found' })

    // Increase view count (Fire and forget, don't await to speed up response)
    PostModel.updateOne({ _id: item._id }, { $inc: { 'stats.views': 1 } }).exec()

    rs.data = item
    return rs

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'error.serverError', message: error.message })
  }
})
