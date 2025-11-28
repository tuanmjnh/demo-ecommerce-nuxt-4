import { UserModel } from '../../models/user.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItems = { type: 'user-get', message: 'success', status: true, data: null }

  try {
    const args = getQuery(event)
    const filter: any = {
      $and: [
        { flag: args.flag !== undefined ? parseInt(String(args.flag)) : 1 },
        { username: { $ne: 'root' } } // Hide root user
      ]
    }

    if (args.text) {
      const regex = new RegExp(String(args.text), 'i')
      filter.$or = [
        { username: regex },
        { email: regex },
        { fullName: regex }, // Note: check model field name (fullName vs fullname)
      ]
    }

    const sortBy = String(args.sortBy || 'created.at')
    const sortType = parseInt(String(args.sortType)) || -1

    rs.data = await CommonService.findAll(UserModel, filter, {
      page: Number(args.page) || 1,
      limit: Number(args.limit) || 20,
      sort: { [sortBy]: sortType },
    })

    return rs

  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error', message: error.message })
  }
})
