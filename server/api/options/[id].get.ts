import { OptionsModel } from '../../models/options.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'options-findById', message: 'success', status: true, data: null }

  try {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, statusMessage: 'noExist', message: 'Missing ID' })

    const item = await CommonService.findById(OptionsModel, id)
    if (!item) throw createError({ statusCode: 404, statusMessage: 'noExist', message: 'Record not found' })

    rs.data = item
    return rs

  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error', message: error.message })
  }
})
