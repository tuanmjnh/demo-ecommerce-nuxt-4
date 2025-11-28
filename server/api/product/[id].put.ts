import { ProductModel } from '../../models/product.model'
import { viToSlug } from 'tm-libs/string'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'product-update', message: 'success', status: true, data: null }

  try {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, message: 'Missing ID' })

    // const data = await validateBody(event, ProductValidation.update)
    const body = await readBody(event)
    // 1. Check duplicate code
    if (body.code) {
      const exist = await CommonService.checkExist(ProductModel, 'code', body.code, id)
      if (exist) {
        throw createError({ statusCode: 400, statusMessage: 'exists', message: 'Product code already exists' })
      }
    }

    // 2. Auto Slug
    if (body.title && !body.slug) {
      body.slug = viToSlug(body.title)
    }

    // 3. Update Meta
    const user = event.context.auth?.user
    const payload = {
      ...body,
      updated: { at: Date.now(), by: user?.username, ip: getRequestIP(event) }
    }

    rs.data = await CommonService.update(ProductModel, id, payload)

    if (!rs.data) throw createError({ statusCode: 404, statusMessage: 'noExist', message: 'Product not found' })

    return rs

  } catch (error: any) {
    throw createError({ statusCode: 400, statusMessage: 'error', message: error.message })
  }
})
