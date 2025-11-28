import { CompanyModel } from '../../models/company.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItems = { type: 'company-getAll', message: 'success', status: true, data: null }

  try {
    const args = getQuery(event)
    const filter: any = { $and: [{ flag: args.flag !== undefined ? parseInt(String(args.flag)) : 1 }] }

    const sortBy = String(args.sortBy || 'sort')
    const sortType = parseInt(String(args.sortType)) || 1

    rs.data = await CommonService.findAll(CompanyModel, filter, {
      page: Number(args.page) || 1,
      limit: Number(args.limit),
      sort: { [sortBy]: sortType }
    })

    return rs

  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error', message: error.message })
  }
})
