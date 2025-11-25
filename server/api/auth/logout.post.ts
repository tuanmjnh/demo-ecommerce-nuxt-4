import { AuthService } from '../../utils/auth.service'

export default defineEventHandler(async (event) => {
  const auth = ensureAuth(event)
  const rs = { type: 'auth-logout', message: 'success', status: true }

  try {
    // Ideally logout just needs the current session info from token
    // But to support specific device logout, we accept deviceId
    const body = await readBody(event)
    // Or use validateBody if strict: await validateBody(event, z.object({ deviceId: z.string() }))

    const userId = auth.user?._id
    if (!userId) throw createError({ statusCode: 401, message: 'Unauthorized' })

    const deviceId = body?.deviceId

    if (!deviceId) throw createError({ statusCode: 400, message: 'Missing Device ID' })

    await AuthService.logout(userId, deviceId)
    return rs

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 400, statusMessage: 'error.logoutFailed', message: error.message })
  }
})
