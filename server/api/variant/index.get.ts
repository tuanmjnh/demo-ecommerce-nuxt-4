import { ModelVariant } from '../../models/variant.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  try {
    const args = getQuery(event)
    // Standard search/filter logic similar to other modules
    const filter: any = {}
    if (args.text) {
      filter.name = new RegExp(String(args.text), 'i')
    }

    const rs = await CommonService.findAll(ModelVariant, filter, {
      page: Number(args.page) || 1,
      limit: Number(args.limit) || 20,
      sort: { order: 1 }
    })

    return { type: 'variant-get', status: true, message: 'success', ...rs }
  } catch (e: any) {
    throw createError({ statusCode: 500, message: e.message })
  }
})
