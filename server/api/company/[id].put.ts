import { CompanyModel } from '../../models/company.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'company-update', message: 'success', status: true, data: null }

  try {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, message: 'Missing ID' })

    // const body = await validateBody(event, CompanyValidation.update)
    const body = await readBody(event)
    const clientIP = getRequestIP(event)
    const user = event.context.auth?.user

    const payload = {
      ...body,
      updated: { at: Date.now(), by: user?.username, ip: clientIP }
    }

    const updated = await CompanyModel.findByIdAndUpdate(
      id,
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
