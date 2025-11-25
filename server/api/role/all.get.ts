import { RoleModel } from '../../models/role.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItems = { type: 'role-getAll', message: 'success', status: true, data: null }

  try {
    const args = getQuery(event)
    const filter: any = { $and: [{ flag: args.flag !== undefined ? parseInt(String(args.flag)) : 1 }] }

    const user = event.context.auth?.user
    if (user?.username !== 'root') {
      filter.$and.push({ level: { $gt: 0 } })
    }

    const sortBy = String(args.sortBy || 'level') // Default sort by level for getAll
    const sortType = parseInt(String(args.sortType)) || 1

    rs.data = await CommonService.findAll(RoleModel, filter, {
      page: Number(args.page) || 1,
      limit: Number(args.limit),
      sort: { [sortBy]: sortType }
    })

    return rs

  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error.serverError', message: error.message })
  }
})
