import { ModelVariant } from '../../models/variant.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs = { success: [], error: [], type: 'variant-delete', message: 'success', status: true }
  try {
    const { items } = await readBody(event)
    const r = await CommonService.deleteByIds(ModelVariant, items)
    Object.assign(rs, r)
    return rs
  } catch (e: any) {
    throw createError({ statusCode: 400, statusMessage: 'error', message: e.message })
  }
})
