import { ConnectModel } from '../../models/connect.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseArray = { success: [], error: [], type: 'connect-delete', message: 'success', status: true }

  try {
    const body = await readBody(event)
    const { items } = body // items is array of IDs

    const r = await CommonService.deleteByIds(ConnectModel, items)

    Object.assign(rs, r)
    return rs

  } catch (error: any) {
    throw createError({ statusCode: 400, statusMessage: 'error.deleteFailed', message: error.message })
  }
})
