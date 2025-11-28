import { UserService } from '../../utils/user.service'

export default defineEventHandler(async (event) => {
  const auth = ensureAuth(event)
  const rs = { type: 'auth-me', message: 'success', status: true, data: null }

  try {
    const userId = auth.user?._id
    if (!userId) throw createError({ statusCode: 401, statusMessage: 'noExistAccount', message: 'Account not found' })

    const user = await UserService.findById(userId)

    if (!user) throw createError({ statusCode: 404, statusMessage: 'noExistAccount', message: 'Account not found' })

    rs.data = user
    return rs

  } catch (error: any) {
    // if (error.statusCode) throw error
    throw createError({ statusCode: 401, statusMessage: 'expired', message: 'Session expired' })
  }
})
