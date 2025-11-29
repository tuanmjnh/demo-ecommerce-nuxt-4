import { GroupModel } from '../../../models/group.model'

export default defineEventHandler(async (event) => {
  const rs: Common.IResponseItems = { type: 'public-get', message: 'success', status: true, data: null }
  try {
    const body = await readBody(event)

    const filter: any = { $and: [{ flag: body.flag !== undefined ? parseInt(String(body.flag)) : 1 }] }
    // Filter by text
    if (body.text) {
      const text = String(body.text)
      filter.$and.push({
        $or: [
          { key: new RegExp(text, 'i') },
          { code: new RegExp(text, 'i') },
          { title: new RegExp(text, 'i') },
        ]
      })
    }
    // Filter by key
    if (body.key) filter.$and.push({ key: String(body.key) })
    if (body.parent) filter.$and.push({ parent: { $in: body.parent } })

    const sortBy = String(body.sortBy || 'sort')
    const sortType = parseInt(String(body.sortType)) || 1

    rs.data = await CommonService.findAll(GroupModel, filter, {
      page: Number(body.page) || 1,
      limit: Number(body.limit) || 10,
      sort: body.sort ? body.sort : { [sortBy]: sortType }
    })

    // rs.data = await CommonService.findAll(GroupModel, filter, { sort: { sort: 1 } })
    return rs

  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'serverError', message: error.message })
  }
})
