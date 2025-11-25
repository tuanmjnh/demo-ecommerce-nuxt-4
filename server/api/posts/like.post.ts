import { PostModel } from '../../models/post.model'

export default defineEventHandler(async (event) => {
  const rs: Common.IResponseItem = { type: 'post-like', message: 'success', status: true, data: null }

  try {
    // const body = await validateBody(event, PostValidation.like)
    // const { newsId, action } = body
    const { newsId, action } = await readBody(event)
    const inc = action === 'remove' ? -1 : 1
    await PostModel.updateOne({ _id: newsId }, { $inc: { 'stats.likes': inc } })

    rs.data = { newsId, action }
    return rs

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 400, statusMessage: 'error.actionFailed', message: error.message })
  }
})
