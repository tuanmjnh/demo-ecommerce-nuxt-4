import { UserService } from '../../utils/user.service'
// UserValidation and validateBody are auto-imported

export default defineEventHandler(async (event) => {
  const auth = ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'profile-update', message: 'success', status: true, data: null }

  try {
    // 1. Get ID from current session
    const userId = auth?.user?._id
    if (!userId) throw createError({ statusCode: 400, statusMessage: 'error.noExistAccount', message: 'Missing ID' })
    // 2. Validate Body (Reuse UserValidation.updateProfile)
    // const body = await validateBody(event, UserValidation.updateProfile)
    const body = await readBody(event)
    // 3. Add tracking info
    const clientIP = getRequestIP(event)
    const payload = {
      ...body,
      updated: { at: Date.now(), by: auth?.user?.username, ip: clientIP }
    }

    // 4. Update
    rs.data = await UserService.updateProfile(userId, payload)
    return rs

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 400, statusMessage: 'error.updateFailed', message: error.message })
  }
})
