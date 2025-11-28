import { ProductModel } from '../../../models/product.model'

export default defineEventHandler(async (event) => {
  const rs: Common.IResponseItems = { type: 'public-get', message: 'success', status: true, data: null }
  try {
    const args = getQuery(event)
    const filter: any = { $and: [{ flag: args.flag !== undefined ? parseInt(String(args.flag)) : 1 }] }

    // Search by text (regex)
    if (args.text) {
      const textRegex = new RegExp(String(args.text), 'i')
      filter.$and.push({
        $or: [
          { code: textRegex },
          { title: textRegex },
          { brand: textRegex },
          { qrcode: textRegex },
          { barcode: textRegex }
        ]
      })
    }

    // Search by Groups
    if (args.groups) {
      const groups = Array.isArray(args.groups) ? args.groups : [args.groups]
      filter.$and.push({ groups: { $in: groups } })
    }

    const sortBy = String(args.sortBy || 'created.at')
    const sortType = parseInt(String(args.sortType)) || -1

    rs.data = await CommonService.findAll(ProductModel, filter, {
      page: Number(args.page) || 1,
      limit: Number(args.limit) || 20,
      sort: { [sortBy]: sortType }
    })

    return rs
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error', message: error.message })
  }
})
