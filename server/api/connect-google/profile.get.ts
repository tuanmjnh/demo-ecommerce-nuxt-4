import { ConnectService } from '../../utils/connect.service'

export default defineEventHandler(async (event) => {
  const rs = { success: true, data: null }

  try {
    const connect = await ConnectService.getByKey('GOOGLE')
    if (!connect.profile) {
      throw createError({ statusCode: 404, message: 'No Google profile found' })
    }

    rs.data = connect.profile
    return rs

  } catch (error: any) {
    throw createError({ statusCode: 500, message: error.message })
  }
})
