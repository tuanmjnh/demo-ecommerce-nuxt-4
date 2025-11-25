import { PostModel } from '../../models/post.model'
import { viToSlug } from 'tm-libs/string'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'post-update', message: 'success', status: true, data: null }

  try {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, statusMessage: 'error.missingId', message: 'Missing ID' })

    // const data = await validateBody(event, PostValidation.update)
    const body = await readBody(event)
    // 1. Check duplicate code
    if (body.code) {
      const exist = await CommonService.checkExist(PostModel, 'code', body.code, id)
      if (exist) {
        throw createError({ statusCode: 400, statusMessage: 'error.exists', message: 'Code already exists' })
      }
    }

    // 2. Auto-generate slug
    if (body.title && !body.slug) {
      body.slug = viToSlug(body.title)
    }

    // 3. Update Meta
    const user = event.context.auth?.user
    const payload = {
      ...body,
      updated: { at: Date.now(), by: user?.username, ip: getRequestIP(event) }
    }

    rs.data = await CommonService.update(PostModel, id, payload)
    if (!rs.data) throw createError({ statusCode: 404, statusMessage: 'error.noExist', message: 'Record not found' })

    return rs

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 400, statusMessage: 'error.updateFailed', message: error.message })
  }
})
