import { PostModel } from '../../../models/post.model'

export default defineEventHandler(async (event) => {
  // No ensureAuth -> Public route
  const rs: Common.IResponseItem = { type: 'post-getBySlug', message: 'success', status: true, data: null }

  try {
    const slug = getRouterParam(event, 'slug')
    if (!slug) throw createError({ statusCode: 400, statusMessage: 'missingSlug', message: 'Missing Slug' })

    // Find active post
    const item = await PostModel.findOne({ slug, flag: 1 })
    if (!item) throw createError({ statusCode: 404, statusMessage: 'noExist', message: 'Post not found' })

    // Increase view count (Fire and forget, don't await to speed up response)
    PostModel.updateOne({ _id: item._id }, { $inc: { 'stats.views': 1 } }).exec()

    rs.data = item
    return rs

  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error', message: error.message })
  }
})
