import { PostModel } from '../../../models/post.model'

export default defineEventHandler(async (event) => {
  const rs: Common.IResponseItems = { type: 'public-get', message: 'success', status: true, data: null }
  try {
    const body = await readBody(event)
    console.log('Request Body:', JSON.stringify(body))
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

    if (body.key) {
      const key = Array.isArray(body.key) ? body.key : [body.key]
      filter.$and.push({ key: { $in: key } })
    }
    // Handle groups array query
    if (body.groups) {
      const groups = Array.isArray(body.groups) ? body.groups : [body.groups]
      filter.$and.push({ groups: { $in: groups } })
    }

    if (body.pins) {
      const pins = Array.isArray(body.pins) ? body.pins : [body.pins]
      filter.$and.push({ pins: { $in: pins } })
    }

    // rs.data = await CommonService.findAll(PostModel, filter, {
    //   page: Number(body.page) || 1,
    //   limit: Number(body.limit) || 20,
    //   sort: body.sort ? body.sort : '-createdAt'
    // })
    rs.data = await CommonService.findAll(PostModel, filter, {
      page: Math.max(1, parseInt(String(body.page || 1))), // Đảm bảo luôn >= 1
      limit: Math.max(1, parseInt(String(body.limit || 20))), // Đảm bảo limit hợp lệ
      sort: body.sort ? body.sort : '-createdAt'
    })

    return rs
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error', message: error.message })
  }
})
