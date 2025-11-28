import { BillingModel } from '../../models/billing.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'billing-getReport', message: 'success', status: true, data: null }

  try {
    const args = getQuery(event)
    const match: any = {}

    // 1. Basic Filters
    match.flag = args.flag !== undefined ? parseInt(String(args.flag)) : 1
    if (args.groupId) match.groupId = args.groupId
    if (args.status) match.status = args.status

    // 2. Date Range
    if (args.dateStart || args.dateEnd) {
      match['created.at'] = {}
      if (args.dateStart) match['created.at'].$gte = Number(args.dateStart)
      if (args.dateEnd) match['created.at'].$lte = Number(args.dateEnd)
    }

    // 3. Group Format
    let groupFormat = '%Y-%m-%d'
    switch (args.type) {
      case 'day': groupFormat = '%Y-%m-%d'; break
      case 'week': groupFormat = '%Y-%U'; break
      case 'month': groupFormat = '%Y-%m'; break
      case 'year': groupFormat = '%Y'; break
    }

    // 4. Pipeline
    const pipeline: any[] = []
    if (Object.keys(match).length > 0) pipeline.push({ $match: match })

    pipeline.push({
      $group: {
        _id: {
          period: { $dateToString: { format: groupFormat, date: { $toDate: '$created.at' } } }
        },
        totalOrders: { $sum: 1 },
        totalAmount: { $sum: { $ifNull: ['$total', 0] } },
      }
    })
    pipeline.push({ $sort: { '_id.period': 1 } })

    const data = await BillingModel.aggregate(pipeline)

    // 5. Summary
    const summary = data.reduce((acc, d) => {
      acc.totalOrders += d.totalOrders || 0
      acc.totalAmount += d.totalAmount || 0
      return acc
    }, { totalOrders: 0, totalAmount: 0 })

    rs.data = { items: data, summary }
    return rs

  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'serverError', message: error.message })
  }
})
