import { PostModel } from '../../models/post.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs: Common.IResponseItems = { type: 'post-get', message: 'success', status: true, data: null }

  try {
    // Use validateBody or readBody directly if loose schema
    // const args = await validateBody(event, PostValidation.items)
    const body = await readBody(event)
    const filter: any = { $and: [{ flag: body.flag !== undefined ? body.flag : 1 }] }

    if (body.text) {
      filter.$and.push({
        $or: [
          { code: new RegExp(body.text, 'i') },
          { title: new RegExp(body.text, 'i') },
          { author: new RegExp(body.text, 'i') }
        ]
      })
    }

    if (body.key) filter.$and.push({ key: body.key })
    if (body.groups && body.groups.length) filter.$and.push({ groups: { $in: body.groups } })
    const sortBy = body.sortBy || 'sort'
    const sortType = body.sortType || 1

    rs.data = await CommonService.findAll(PostModel, filter, {
      page: body.page || 1,
      limit: body.limit || 10,
      sort: { [sortBy]: sortType }
    })

    return rs

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'error.serverError', message: error.message })
  }
})
