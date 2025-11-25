import { CompanyModel } from '../../models/company.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItems = { type: 'company-get', message: 'success', status: true, data: null }

  try {
    const args = getQuery(event)
    const filter: any = { $and: [{ flag: args.flag !== undefined ? parseInt(String(args.flag)) : 1 }] }

    if (args.text) {
      const text = String(args.text)
      filter.$and.push({
        $or: [
          { name: new RegExp(text, 'i') },
          { shortName: new RegExp(text, 'i') },
          { email: new RegExp(text, 'i') },
          { phone: new RegExp(text, 'i') },
        ]
      })
    }

    const sortBy = String(args.sortBy || 'sort')
    const sortType = parseInt(String(args.sortType)) || 1

    rs.data = await CommonService.findAll(CompanyModel, filter, {
      page: Number(args.page) || 1,
      limit: Number(args.limit) || 10,
      sort: { [sortBy]: sortType }
    })

    return rs

  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error.serverError', message: error.message })
  }
})
