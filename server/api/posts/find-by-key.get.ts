import { PostModel } from '../../models/post.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'post-findByKey', message: 'success', status: true, data: null }

  try {
    const args = getQuery(event)
    if (!args.key) throw createError({ statusCode: 400, message: 'Missing key' })

    const item = await CommonService.findOne(PostModel, { key: args.key })

    rs.data = item
    return rs

  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error', message: error.message })
  }
})
