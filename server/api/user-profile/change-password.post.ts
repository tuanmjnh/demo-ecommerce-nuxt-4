import { UserService } from '../../utils/user.service'

export default defineEventHandler(async (event) => {
  const auth = ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'profile-changePassword', message: 'success', status: true, data: null }

  try {
    const userId = auth?.user?._id
    if (!userId) throw createError({ statusCode: 400, statusMessage: 'noExistAccount', message: 'Missing ID' })

    // 1. Validate Body
    // const body = await validateBody(event, UserValidation.changePassword)
    const body = await readBody(event)
    // 2. Call Service
    rs.data = await UserService.changePassword(userId, body.oldPassword, body.newPassword)

    return rs

  } catch (error: any) {
    // if (error.statusCode) throw error

    if (error.message === 'password')
      throw createError({ statusCode: 400, statusMessage: 'invalidPassword', message: 'Incorrect old password' })

    throw createError({ statusCode: 400, statusMessage: 'error', message: error.message })
  }
})
