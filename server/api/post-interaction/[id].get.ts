import { PostInteractionModel } from '../../models/post-interaction.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'PostInteraction-findById', message: 'success', status: true, data: null }

  try {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, message: 'Missing ID' })

    const item = await PostInteractionModel.findOne({ _id: id, flag: 1 })
    if (!item) throw createError({ statusCode: 404, statusMessage: 'noExist', message: 'Interaction not found' })

    rs.data = item
    return rs

  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error', message: error.message })
  }
})
