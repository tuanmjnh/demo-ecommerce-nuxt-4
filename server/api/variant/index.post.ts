import { ModelVariant } from '../../models/variant.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  try {
    // const body = await validateBody(event, EcommerceValidation.variant.create)
    const body = await readBody(event)
    const user = event.context.auth?.user
    const payload = {
      ...body,
      created: { at: Date.now(), by: user?.username, ip: getRequestIP(event) || null }
    }

    const created = await CommonService.create(ModelVariant, payload)
    return { type: 'variant-create', status: true, message: 'success', data: created }
  } catch (e: any) {
    if (e.statusCode) throw e
    throw createError({ statusCode: 400, message: e.message })
  }
})
