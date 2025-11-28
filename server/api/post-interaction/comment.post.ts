import { PostInteractionModel } from '../../models/post-interaction.model'
import { PostModel } from '../../models/post.model'

export default defineEventHandler(async (event) => {
  // Usually requires auth
  // ensureAuth(event)

  try {
    // const body = await validateBody(event, PostInteractionValidation.comment)
    const body = await readBody(event)
    const { PostId, userId, comment } = body

    await PostModel.updateOne({ _id: PostId }, { $inc: { 'stats.comments': 1 } })

    const item = await PostInteractionModel.create({
      postId: PostId,
      userId,
      type: 'comment',
      comment,
    })

    return { status: true, message: 'comment added', data: item }

  } catch (error: any) {
    throw createError({ statusCode: 400, statusMessage: 'error', message: error.message })
  }
})
