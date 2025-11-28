import { PostInteractionModel } from '../../models/post-interaction.model'
import { PostModel } from '../../models/post.model'

export default defineEventHandler(async (event) => {
  // ensureAuth(event) // Optional: if guest like is not allowed
  try {
    // const body = await validateBody(event, PostInteractionValidation.like)
    // const { PostId, userId, action } = body
    const { PostId, userId, action } = await readBody(event)

    const inc = action === 'remove' ? -1 : 1

    // 1. Update Post Stats
    await PostModel.updateOne({ _id: PostId }, { $inc: { 'stats.likes': inc } })

    // 2. Manage Interaction Record
    if (action === 'add') {
      // Check if already liked to prevent duplicates? (Optional logic)
      await PostInteractionModel.create({
        postId: PostId,
        userId,
        type: 'like',
        action
      })
    } else {
      await PostInteractionModel.deleteOne({
        postId: PostId,
        userId,
        type: 'like'
      })
    }

    return { status: true, message: `like ${action}ed` }

  } catch (error: any) {
    throw createError({ statusCode: 400, statusMessage: 'error', message: error.message })
  }
})
