import { UserModel } from '../../models/user.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItems = { type: 'user-get', message: 'success', status: true, data: null }

  try {
    // const body = await validateBody(event, UserValidation.items)
    const body = await readBody(event)
    const filter: any = {
      $and: [
        { flag: body.flag !== undefined ? body.flag : 1 },
        { username: { $ne: 'root' } }
      ]
    }

    if (body.text) {
      const regex = new RegExp(body.text, 'i')
      filter.$or = [
        { username: regex },
        { email: regex },
        { fullName: regex }
      ]
    }

    if (body.groups && body.groups.length > 0) {
      filter.$and.push({ groups: { $in: body.groups } })
    }

    const sortBy = body.sortBy || 'created.at'
    const sortType = body.sortType || -1

    rs.data = await CommonService.findAll(UserModel, filter, {
      page: body.page || 1,
      limit: body.limit || 10,
      sort: { [sortBy]: sortType }
    })

    return rs

  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error', message: error.message })
  }
})
