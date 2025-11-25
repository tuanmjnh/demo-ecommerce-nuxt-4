import { PostModel } from '../../models/post.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'post-findById', message: 'success', status: true, data: null }

  try {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, statusMessage: 'error.missingId', message: 'Missing ID' })

    const item = await CommonService.findById(PostModel, id)
    if (!item) throw createError({ statusCode: 404, statusMessage: 'error.noExist', message: 'Record not found' })

    rs.data = item
    return rs

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'error.serverError', message: error.message })
  }
})
