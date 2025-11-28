import { PostModel } from '../../../models/post.model'

export default defineEventHandler(async (event) => {
  const rs: Common.IResponseItems = { type: 'public-get', message: 'success', status: true, data: null }
  try {
    const body = await readBody(event)
    const filter: any = { $and: [{ flag: body.flag !== undefined ? parseInt(String(body.flag)) : 1 }] }
    if (body.text) {
      filter.$and.push({
        $or: [
          { key: new RegExp(body.text, 'i') },
          { code: new RegExp(body.text, 'i') },
          { title: new RegExp(body.text, 'i') },
        ]
      })
    }

    if (body.key) filter.$and.push({ key: String(body.key) })

    // Handle groups array query
    if (body.groups) {
      const groups = Array.isArray(body.groups) ? body.groups : [body.groups]
      filter.$and.push({ groups: { $in: groups } })
    }

    if (body.pins) {
      const pins = Array.isArray(body.pins) ? body.pins : [body.pins]
      filter.$and.push({ pins: { $in: pins } })
    }

    const sortBy = String(body.sortBy || 'createdAt')
    const sortType = parseInt(String(body.sortType)) || -1

    rs.data = await CommonService.findAll(PostModel, filter, {
      page: Number(body.page) || 1,
      limit: Number(body.limit) || 20,
      sort: body.sort ? body.sort : { [sortBy]: sortType }
    })

    return rs
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error', message: error.message })
  }
})
