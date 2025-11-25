import { GroupModel } from '../../models/group.model'
import { viToSlug } from 'tm-libs/string'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'group-update', message: 'success', status: true, data: null }

  try {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({ statusCode: 400, statusMessage: 'error.missingId', message: 'Missing ID' })
    }

    // 1. Validate Body
    // const data = await validateBody(event, GroupValidation.update)
    const body = await readBody(event)
    // 2. Check duplicates (if code is being updated)
    if (body.code) {
      const exist = await CommonService.checkExist(GroupModel, 'code', body.code, id)
      if (exist) {
        throw createError({
          statusCode: 400,
          statusMessage: 'error.exists',
          message: 'Code already exists'
        })
      }
    }

    // 3. Auto-generate slug (only if title changed and slug not explicitly provided)
    if (body.title && !body.slug) {
      body.slug = viToSlug(body.title)
    }

    // 4. Update Meta
    const user = event.context.auth?.user
    const payload = {
      ...body,
      updated: { at: Date.now(), by: user?.username, ip: getRequestIP(event) }
    }

    // 5. Update DB
    rs.data = await CommonService.update(GroupModel, id, payload)

    if (!rs.data) {
      throw createError({ statusCode: 404, statusMessage: 'error.noExist', message: 'Record not found' })
    }

    return rs

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 400,
      statusMessage: 'error.updateFailed',
      message: error.message
    })
  }
})
