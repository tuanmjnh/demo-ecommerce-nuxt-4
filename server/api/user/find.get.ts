import { UserModel } from '../../models/user.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'user-find', message: 'success', status: true, data: null }

  try {
    const args = getQuery(event)
    const item = await CommonService.findOne(UserModel, args)
    if (!item) throw createError({ statusCode: 404, statusMessage: 'error.noExist', message: 'User not found' })

    // Ensure sensitive data is not returned (CommonService.findOne returns document, might need manual selection)
    const u: Partial<Models.User> = item.toObject ? item.toObject() : item
    delete u.password
    delete u.salt

    rs.data = u
    return rs

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'error.serverError', message: error.message })
  }
})
