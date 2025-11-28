export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'user-update', message: 'success', status: true, data: null }

  try {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, statusMessage: 'noExist', message: 'Missing ID' })

    // const data = await validateBody(event, UserValidation.update)
    const body = await readBody(event)
    const clientIP = getRequestIP(event)
    const user = event.context.auth?.user
    const payload = {
      ...body,
      updated: { at: Date.now(), by: user?.username, ip: clientIP }
    }

    rs.data = await UserService.update(id, payload)
    return rs

  } catch (error: any) {
    // if (error.statusCode) throw error
    // if (error.message === 'existUsername' || error.message === 'existEmail') {
    //   throw createError({ statusCode: 400, statusMessage: `error.${error.message}`, message: 'User already exists' })
    // }
    throw createError({ statusCode: 400, statusMessage: 'error', message: error.message })
  }
})
