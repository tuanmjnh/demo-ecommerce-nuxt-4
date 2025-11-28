import { AuthService } from '../../utils/auth.service'

export default defineEventHandler(async (event) => {
  const rs: Common.IResponseItem = { type: 'auth-register', message: 'success', status: true, data: null }

  try {
    const body = await validateBody(event, AuthValidation.register)

    const result = await AuthService.register(body)
    rs.data = result.user

    setResponseStatus(event, 201)
    return rs

  } catch (error: any) {
    // if (error.statusCode) throw error
    // Map existing service errors
    // if (error.message === 'existUsername' || error.message === 'existEmail') {
    //   throw createError({ statusCode: 400, statusMessage: `error.${error.message}`, message: 'User already exists' })
    // }
    throw createError({ statusCode: 400, statusMessage: 'existUsername', message: 'User already exists' })
  }
})
