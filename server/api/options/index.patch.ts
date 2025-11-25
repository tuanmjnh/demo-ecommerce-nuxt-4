import { OptionsModel } from '../../models/options.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs = { success: [], error: [], type: 'options-updateFlag', message: 'success', status: true }

  try {
    const { items, flag } = await readBody(event)

    const r = await CommonService.updateFlagByIds(OptionsModel, items, flag)

    Object.assign(rs, r)

    return rs
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: 'error.updateFailed',
      message: error.message
    })
  }
})
