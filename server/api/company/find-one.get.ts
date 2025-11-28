import { CompanyModel } from '../../models/company.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'company-find-one', message: 'success', status: true, data: null }

  try {
    const args = getQuery(event)
    rs.data = await CommonService.findOne(CompanyModel, args)

    if (!rs.data) throw createError({ statusCode: 404, statusMessage: 'noExist', message: 'Company not found' })

    return rs

  } catch (error: any) {
    // if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'error', message: error.message })
  }
})
