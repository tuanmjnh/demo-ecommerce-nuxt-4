import { BillingModel } from '../../models/billing.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItems = { type: 'billing-get', message: 'success', status: true, data: null }

  try {
    const args = getQuery(event)

    const filter: any = {
      $and: [{
        flag: args.flag !== undefined ? parseInt(String(args.flag)) : 1,
        // Filter by status (default 'serving' if not provided or specific logic needed)
        status: args.status !== undefined ? args.status : 'serving'
      }]
    }

    // Date Range
    if (args.dateStart && args.dateEnd) {
      filter.$and.push({
        ['created.at']: {
          $gte: Number(args.dateStart),
          $lte: Number(args.dateEnd)
        }
      })
    }

    if (args.groupId) {
      filter.$and.push({ groupId: String(args.groupId) })
    }

    const sortBy = String(args.sortBy || 'created.at')
    const sortType = parseInt(String(args.sortType)) || -1

    rs.data = await CommonService.findAll(BillingModel, filter, {
      page: Number(args.page) || 1,
      limit: Number(args.limit) || 10,
      sort: { [sortBy]: sortType }
    })

    return rs

  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error.serverError', message: error.message })
  }
})
