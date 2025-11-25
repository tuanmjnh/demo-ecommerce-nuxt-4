import { GroupModel } from '../../models/group.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItems = { type: 'group-getAll', message: 'success', status: true, data: null }

  try {
    const args = getQuery(event)
    const filter: any = {}

    if (args.flag !== undefined) filter.flag = parseInt(String(args.flag))
    if (args.key) filter.key = String(args.key)

    const sortBy = String(args.sortBy || 'sort')
    const sortType = parseInt(String(args.sortType)) || 1

    // limit: 0 implies getting all records
    rs.data = await CommonService.findAll(GroupModel, filter, {
      page: Number(args.page) || 1,
      limit: Number(args.limit),
      sort: { [sortBy]: sortType }
    })

    return rs

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'error.serverError',
      message: error.message
    })
  }
})
