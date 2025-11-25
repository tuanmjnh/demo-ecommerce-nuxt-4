import { PostInteractionModel } from '../../models/post-interaction.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'PostInteraction-delete', message: 'success', status: true, data: null }

  try {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, message: 'Missing ID' })

    // Soft delete (set flag to 0)
    const data = await PostInteractionModel.findByIdAndUpdate(
      id,
      { flag: 0 },
      { new: true }
    )

    if (!data) throw createError({ statusCode: 404, statusMessage: 'error.noExist', message: 'Interaction not found' })

    rs.data = data
    return rs

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 400, statusMessage: 'error.deleteFailed', message: error.message })
  }
})
