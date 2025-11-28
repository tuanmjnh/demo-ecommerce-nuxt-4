import { ModelVariant } from '../../models/variant.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  try {
    const id = getRouterParam(event, 'id')
    // const data = await validateBody(event, EcommerceValidation.variant.update)
    const body = await readBody(event)
    const user = event.context.auth?.user
    const payload = {
      ...body,
      updated: { at: Date.now(), by: user?.username, ip: getRequestIP(event) }
    }

    const updated = await CommonService.update(ModelVariant, id!, payload)
    if (!updated) throw createError({ statusCode: 404, statusMessage: 'noExist', message: 'Variant not found' })

    return { type: 'variant-update', status: true, message: 'success', data: updated }
  } catch (e: any) {
    throw createError({ statusCode: 400, statusMessage: 'error', message: e.message })
  }
})
