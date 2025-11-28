export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'user-resetPassword', message: 'success', status: true, data: null }

  try {
    // const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    if (!body || !body.userId || !body.password)
      throw createError({ statusCode: 400, statusMessage: 'noExistAccount', message: 'Missing ID' })
    // Get default reset password from config or body?
    // Old code used: req.configs.password_reset. Assuming passed in body or env.
    // Let's check body first
    // const body = await readBody(event)
    // let newPass = body?.newPassword

    // if (!newPass) {
    //   // Fallback to runtime config
    //   const config = useRuntimeConfig()
    //   // newPass = config.defaultResetPassword // You need to define this in nuxt.config.ts
    //   if (!newPass) throw createError({ statusCode: 400, message: 'New password not provided' })
    // }
    await UserService.resetPassword(body.userId, body.password)
    rs.data = body.password
    return rs

  } catch (error: any) {
    throw createError({ statusCode: 400, statusMessage: 'error', message: error.message })
  }
})
