import { ProductModel } from '../../models/product.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItems = { type: 'product-get', message: 'success', status: true, data: null }

  try {
    // const body = await validateBody(event, ProductValidation.items)
    const body = await readBody(event)
    const filter: any = { $and: [{ flag: body.flag !== undefined ? body.flag : 1 }] }

    if (body.text) {
      const textRegex = new RegExp(body.text, 'i')
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

    if (body.groups && body.groups.length > 0) {
      filter.$and.push({ groups: { $in: body.groups } })
    }

    const sortBy = body.sortBy || 'sort'
    const sortType = body.sortType || 1

    rs.data = await CommonService.findAll(ProductModel, filter, {
      page: body.page || 1,
      limit: body.limit || 10,
      sort: { [sortBy]: sortType }
    })

    return rs

  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error', message: error.message })
  }
})
