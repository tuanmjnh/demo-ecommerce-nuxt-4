import { RoleModel } from '../../models/role.model'

export default defineEventHandler(async (event) => {
  // 1. Auth Check
  ensureAuth(event)

  const rs: Common.IResponseItems = { type: 'role-get', message: 'success', status: true, data: null }

  try {
    const args = getQuery(event)
    const filter: any = { $and: [{ flag: args.flag !== undefined ? parseInt(String(args.flag)) : 1 }] }

    // Search
    if (args.text) {
      const text = String(args.text)
      filter.$and.push({
        $or: [
          { key: new RegExp(text, 'i') },
          { code: new RegExp(text, 'i') },
          { title: new RegExp(text, 'i') },
        ]
      })
    }

    // Root Check Logic (from original controller)
    const user = event.context.auth?.user
    if (user?.username !== 'root') {
      filter.$and.push({ level: { $gt: 0 } })
    }

    const sortBy = String(args.sortBy || 'sort')
    const sortType = parseInt(String(args.sortType)) || 1

    rs.data = await CommonService.findAll(RoleModel, filter, {
      page: Number(args.page) || 1,
      limit: Number(args.limit) || 10,
      sort: { [sortBy]: sortType }
    })

    return rs

  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error', message: error.message })
  }
})
