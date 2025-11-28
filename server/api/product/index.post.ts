import { ProductModel } from '../../models/product.model'
import { viToSlug } from 'tm-libs/string'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'product-create', message: 'success', status: true, data: null }

  try {
    // const data = await validateBody(event, ProductValidation.create)
    const body = await readBody(event)
    // 1. Check duplicate code
    if (body.code) {
      const exist = await CommonService.checkExist(ProductModel, 'code', body.code)
      if (exist) {
        throw createError({ statusCode: 400, statusMessage: 'exists', message: 'Product code already exists' })
      }
    }

    // 2. Auto Slug
    if (!body.slug && body.title) {
      body.slug = viToSlug(body.title)
    }

    // 3. Add Meta
    const user = event.context.auth?.user
    const payload = {
      ...body,
      created: { at: Date.now(), by: user?.username, ip: getRequestIP(event) || null }
    }

    // 4. Save
    rs.data = await CommonService.create(ProductModel, payload)

    setResponseStatus(event, 201)
    return rs

  } catch (error: any) {
    throw createError({ statusCode: 400, statusMessage: 'error', message: error.message })
  }
})
