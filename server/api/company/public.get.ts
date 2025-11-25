import { CompanyModel } from '../../models/company.model'

export default defineEventHandler(async (event) => {
  const rs: Common.IResponseItem = { type: 'public-get', message: 'success', status: true, data: null }
  try {
    const args = getQuery(event)
    rs.data = await CommonService.findOne(CompanyModel, args)
    return rs

  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error.serverError', message: error.message })
  }
})
