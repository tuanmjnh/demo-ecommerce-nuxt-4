import { PostInteractionModel } from '../../models/post-interaction.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'PostInteraction-update', message: 'success', status: true, data: null }

  try {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, message: 'Missing ID' })

    const data = await readBody(event) // Validate schema if strictly required

    rs.data = await CommonService.update(PostInteractionModel, id, data)

    if (!rs.data) throw createError({ statusCode: 404, statusMessage: 'noExist', message: 'Interaction not found' })

    return rs

  } catch (error: any) {
    throw createError({ statusCode: 400, statusMessage: 'error', message: error.message })
  }
})
