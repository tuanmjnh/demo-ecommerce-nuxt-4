import { PostModel } from '../../models/post.model'
import { viToSlug } from 'tm-libs/string'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'post-create', message: 'success', status: true, data: null }

  try {
    // const data = await validateBody(event, PostValidation.create)
    const body = await readBody(event)
    // 1. Check duplicate code
    if (body.code) {
      const exist = await CommonService.checkExist(PostModel, 'code', body.code)
      if (exist) {
        throw createError({ statusCode: 400, statusMessage: 'error.exists', message: 'Code already exists' })
      }
    }

    // 2. Generate slug
    if (!body.slug && body.title) {
      body.slug = viToSlug(body.title)
    }

    // 3. Add meta
    const user = event.context.auth?.user
    const payload = {
      ...body,
      created: { at: Date.now(), by: user?.username, ip: getRequestIP(event) || null }
    }

    rs.data = await CommonService.create(PostModel, payload)
    setResponseStatus(event, 201)
    return rs

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 400, statusMessage: 'error.createFailed', message: error.message })
  }
})
