import { PostInteractionModel } from '../../models/post-interaction.model'
import { PostModel } from '../../models/post.model'

export default defineEventHandler(async (event) => {
  // Public route usually
  try {
    // const body = await validateBody(event, PostInteractionValidation.view)
    // const { PostId, PostSlug, ip, userAgent, sessionId } = body
    const { PostId, PostSlug, ip, userAgent, sessionId } = await readBody(event)
    // 1. Log View Interaction
    await PostInteractionModel.create({
      postId: PostId,
      postSlug: PostSlug,
      ip,
      userAgent,
      sessionId,
      type: 'view',
    })

    // 2. Increment Post Stats
    await PostModel.updateOne({ _id: PostId }, { $inc: { 'stats.views': 1 } })

    return { status: true, message: 'view added' }

  } catch (error: any) {
    throw createError({ statusCode: 400, statusMessage: 'error', message: error.message })
  }
})
