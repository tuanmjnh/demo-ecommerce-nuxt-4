export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'user-resetPassword', message: 'success', status: true, data: null }

  try {
    // const id = getRouterParam(event, 'id')
    const id = await readBody(event)
    if (!id) throw createError({ statusCode: 400, statusMessage: 'error.noExistAccount', message: 'Missing ID' })
    const config = useRuntimeConfig()
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

    rs.data = await UserService.resetPassword(id, config.password_reset || 'Bk123456@')
    return rs

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 400, statusMessage: 'error.actionFailed', message: error.message })
  }
})
