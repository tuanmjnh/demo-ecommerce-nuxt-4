import { GroupModel } from '../../models/group.model'
import { viToSlug } from 'tm-libs/string'
// GroupValidation and validateBody are auto-imported

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'group-create', message: 'success', status: true, data: null }

  try {
    // 1. Validate Body using Zod
    // const body = await validateBody(event, GroupValidation.create)
    const body = await readBody(event)
    // 2. Check duplicate code
    if (body.code) {
      const exist = await CommonService.checkExist(GroupModel, 'code', body.code)
      if (exist) {
        throw createError({
          statusCode: 400,
          statusMessage: 'exists',
          message: 'Code already exists'
        })
      }
    }

    // 3. Auto-generate slug if not provided
    if (!body.slug && body.title) {
      body.slug = viToSlug(body.title)
    }

    // 4. Add Meta Data
    const user = event.context.auth?.user

    // Prepare final payload
    const payload = {
      ...body,
      created: { at: Date.now(), by: user?.username, ip: getRequestIP(event) || null }
    }

    // 5. Save to DB
    rs.data = await CommonService.create(GroupModel, payload)

    setResponseStatus(event, 201)
    return rs

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 400, statusMessage: 'error', message: error.message })
  }
})
