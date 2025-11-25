import { ConnectModel } from '../../models/connect.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseArray = { success: [], error: [], type: 'connect-updateFlag', message: 'success', status: true }

  try {
    const body = await readBody(event)
    const { items, flag } = body

    const r = await CommonService.updateFlagByIds(ConnectModel, items, flag)

    Object.assign(rs, r)
    return rs

  } catch (error: any) {
    throw createError({ statusCode: 400, statusMessage: 'error.updateFailed', message: error.message })
  }
})
