import { BillingModel } from '../../models/billing.model'
// BillingValidation, validateBody, calculateBillingTotal are auto-imported

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItem = { type: 'billing-create', message: 'success', status: true, data: null }

  try {
    // const body = await validateBody(event, BillingValidation.create)
    const body = await readBody(event)
    const user = event.context.auth?.user

    // 1. Generate Code
    const code = `HD${Date.now()}`

    // 2. Prepare Object
    const order: Models.Billing = {
      key: `group_${body.group.code}`,
      code,
      groupId: String(body.group._id),
      items: body.billing.items,
      customer: body.billing.customer,
      note: body.billing.note,
      total: calculateBillingTotal(body.billing.items),
      status: 'serving',
      flag: 1,
      created: { at: Date.now(), by: user?.username || '', ip: getRequestIP(event) || null },
      history: [],
      // refreshToken/deviceId required by strict interface if present, otherwise optional in schema
    }

    // 3. Save
    rs.data = await CommonService.create(BillingModel, order)

    // Optional: Update Group status to 'serving' if needed
    // await GroupModel.findByIdAndUpdate(body.group._id, { status: 'serving' })

    setResponseStatus(event, 201)
    return rs

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 400, statusMessage: 'error.createFailed', message: error.message })
  }
})
