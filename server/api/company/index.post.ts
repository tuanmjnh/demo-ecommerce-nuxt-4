import { CompanyModel } from '../../models/company.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'company-update', message: 'success', status: true, data: null }

  try {
    // Validate body if needed (using partial update schema)
    // const body = await validateBody(event, CompanyValidation.update)
    const body = await readBody(event)
    const user = event.context.auth?.user

    const payload = {
      ...body,
      updated: { at: Date.now(), by: user?.username, ip: getRequestIP(event) || null }
    }

    // Upsert the singleton record (empty filter {})
    // This ensures only one company record exists usually
    const updated = await CompanyModel.findOneAndUpdate(
      {},
      payload,
      { new: true, upsert: true }
    )

    rs.data = updated
    return rs

  } catch (error: any) {
    // if (error.statusCode) throw error
    // console.error(error)
    throw createError({ statusCode: 400, statusMessage: 'error', message: error.message })
  }
})
