export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'user-create', message: 'success', status: true, data: null }

  try {
    // const body = await validateBody(event, UserValidation.create)
    const body = await readBody(event)
    const clientIP = getRequestIP(event) || null
    const user = event.context.auth?.user
    const payload = {
      ...body,
      created: { at: Date.now(), by: user?.username, ip: clientIP }
    }

    rs.data = await UserService.create(payload)

    setResponseStatus(event, 201)
    return rs

  } catch (error: any) {
    // if (error.statusCode) throw error
    // // Handle specific service errors (defined in UserService)
    // if (error.message === 'existUsername' || error.message === 'existEmail') {
    //   throw createError({ statusCode: 400, statusMessage: `error.${error.message}`, message: 'User already exists' })
    // }
    throw createError({ statusCode: 400, statusMessage: 'error', message: error.message })
  }
})
