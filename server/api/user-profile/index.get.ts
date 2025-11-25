import { UserService } from '../../utils/user.service'

export default defineEventHandler(async (event) => {
  // 1. Require Auth
  const auth = ensureAuth(event)

  const rs: Common.IResponseItem = { type: 'profile-get', message: 'success', status: true, data: null }

  try {
    // 2. Get ID from current session
    const userId = auth?.user?._id
    if (!userId) throw createError({ statusCode: 400, statusMessage: 'error.noExistAccount', message: 'Missing ID' })

    // 3. Find user
    const user = await UserService.findById(userId)
    if (!user) throw createError({ statusCode: 404, statusMessage: 'error.noExist', message: 'User not found' })

    rs.data = user
    return rs

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'error.serverError', message: error.message })
  }
})
