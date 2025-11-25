import { PostModel } from '../../models/post.model'

export default defineEventHandler(async (event) => {
  const rs: Common.IResponseItem = { type: 'post-rate', message: 'success', status: true, data: null }

  try {
    // const body = await validateBody(event, PostValidation.rate)
    // const { newsId, rating } = body
    const { newsId, rating } = await readBody(event)
    const news = await PostModel.findById(newsId)
    if (!news) throw createError({ statusCode: 404, statusMessage: 'error.noExist', message: 'Post not found' })

    // Calculate new rating
    const currentCount = news.stats?.ratingCount || 0
    const currentAvg = news.stats?.ratingAverage || 0

    const newCount = currentCount + 1
    const newAverage = ((currentAvg * currentCount) + rating) / newCount

    await PostModel.updateOne({ _id: newsId }, {
      $set: {
        'stats.ratingCount': newCount,
        'stats.ratingAverage': newAverage,
      }
    })

    rs.data = { newsId, newCount, newAverage }
    return rs

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 400, statusMessage: 'error.actionFailed', message: error.message })
  }
})
