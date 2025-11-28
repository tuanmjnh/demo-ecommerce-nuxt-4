import { OptionsModel } from '../../models/options.model'

export default defineEventHandler(async (event) => {
  const rs: Common.IResponseItem = { type: 'options-getAll', message: 'success', status: true, data: null }
  try {
    rs.data = await OptionsModel.find({ key: 'meta', flag: 1 }).select(['value', 'title']).sort({ 'created.at': -1 })
    return rs
  } catch (e: any) {
    return { data: [], status: false, message: e.message }
  }
})
