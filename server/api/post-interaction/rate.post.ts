import { PostInteractionModel } from '../../models/post-interaction.model'
import { PostModel } from '../../models/post.model'

export default defineEventHandler(async (event) => {
  try {
    // const body = await validateBody(event, PostInteractionValidation.rate)
    // const { PostId, userId, rating } = body
    const { PostId, userId, rating } = await readBody(event)
    const post = await PostModel.findById(PostId)
    if (!post) throw createError({ statusCode: 404, message: 'noExist' })

    // Calculate new stats
    const currentCount = post.stats?.ratingCount || 0
    const currentAvg = post.stats?.ratingAverage || 0

    const newCount = currentCount + 1
    const newAverage = ((currentAvg * currentCount) + rating) / newCount

    // Update Post
    await PostModel.updateOne({ _id: PostId }, {
      $set: {
        'stats.ratingCount': newCount,
        'stats.ratingAverage': newAverage,
      },
    })

    // Create Interaction Record
    await PostInteractionModel.create({
      postId: PostId,
      userId,
      type: 'rate',
      rating,
    })

    return { status: true, message: 'rating added', data: { newCount, newAverage } }

  } catch (error: any) {
    throw createError({ statusCode: 400, statusMessage: 'error', message: error.message })
  }
})
