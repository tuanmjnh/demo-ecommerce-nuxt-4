import { PostModel } from '../../models/post.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs = { success: [], error: [], type: 'post-delete', message: 'success', status: true }

  try {
    const { items } = await readBody(event)
    const r = await CommonService.deleteByIds(PostModel, items)
    Object.assign(rs, r)
    return rs
  } catch (error: any) {
    throw createError({ statusCode: 400, statusMessage: 'error', message: error.message })
  }
})
