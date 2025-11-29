import { PostModel } from '../../models/post.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'posts-exist', message: 'success', status: true, data: null }

  try {
    // const args = getQuery(event)
    // const filter = typeof args.filter === 'string' ? JSON.parse(args.filter) : args.filter
    const body = await readBody(event)
    rs.status = await CommonService.exists(PostModel, body.filter, body.id ? String(body.id) : undefined)
    return rs
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error', message: error.message })
  }
})
