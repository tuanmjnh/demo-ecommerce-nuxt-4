import { PostInteractionModel } from '../../models/post-interaction.model'

export default defineEventHandler(async (event) => {
  // ensureAuth(event) // Depends if creation is public or protected
  const rs: Common.IResponseItem = { type: 'PostInteraction-create', message: 'success', status: true, data: null }

  try {
    // const data = await validateBody(event, PostInteractionValidation.create)
    const body = await readBody(event)
    // Auto-fill timestamps handled by Mongoose schema
    rs.data = await CommonService.create(PostInteractionModel, body)

    setResponseStatus(event, 201)
    return rs

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 400, statusMessage: 'error.createFailed', message: error.message })
  }
})
