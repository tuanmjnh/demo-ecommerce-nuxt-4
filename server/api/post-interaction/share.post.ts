import { PostInteractionModel } from '../../models/post-interaction.model'
import { PostModel } from '../../models/post.model'

export default defineEventHandler(async (event) => {
  try {
    // const body = await validateBody(event, PostInteractionValidation.share)
    // const { PostId, userId } = body
    const { PostId, userId } = await readBody(event)
    await PostModel.updateOne({ _id: PostId }, { $inc: { 'stats.shares': 1 } })

    await PostInteractionModel.create({
      postId: PostId,
      userId,
      type: 'share'
    })

    return { status: true, message: 'share added' }

  } catch (error: any) {
    throw createError({ statusCode: 400, message: error.message })
  }
})
