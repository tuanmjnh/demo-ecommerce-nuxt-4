import { AuthService } from '../../utils/auth.service'

export default defineEventHandler(async (event) => {
  const auth = ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'auth-devices', message: 'success', status: true, data: null }

  try {
    if (!auth.user?._id) throw createError({ statusCode: 404, statusMessage: 'noExistAccount', message: 'Account not found' })
    const devices = await AuthService.listDevices(auth.user._id)

    if (!devices || devices.length === 0) {
      // Note: It's weird if listDevices is empty while user is logged in,
      // but we handle it anyway.
      throw createError({ statusCode: 404, statusMessage: 'noExistDevices', message: 'No devices found' })
    }

    rs.data = devices
    return rs

  } catch (error: any) {
    // if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'serverError', message: error.message })
  }
})
