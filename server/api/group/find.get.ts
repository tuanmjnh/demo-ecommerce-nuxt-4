import { GroupModel } from '../../models/group.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'group-find', message: 'success', status: true, data: null }

  try {
    const args = getQuery(event)

    rs.data = await CommonService.findOne(GroupModel, args)

    if (!rs.data) {
      throw createError({ statusCode: 404, statusMessage: 'noExist', message: 'Record not found' })
    }

    return rs

  } catch (error: any) {
    // Rethrow H3 Error if already created
    // if (error.statusCode) throw error

    throw createError({ statusCode: 500, statusMessage: 'error', message: error.message })
  }
})
