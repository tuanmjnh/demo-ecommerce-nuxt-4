import { PostInteractionModel } from '../../models/post-interaction.model'

export default defineEventHandler(async (event) => {
  ensureAuth(event) // Usually admin only
  const rs: Common.IResponseItems = { type: 'PostInteraction-getAll', message: 'success', status: true, data: null }

  try {
    const args = getQuery(event)
    const filter: any = { flag: 1 }

    if (args.PostId) filter.postId = args.PostId // Note: schema uses camelCase 'postId' but query might use PascalCase 'PostId'
    if (args.userId) filter.userId = args.userId
    if (args.type) filter.type = args.type

    rs.data = await CommonService.findAll(PostInteractionModel, filter, {
      page: Number(args.page) || 1,
      limit: Number(args.limit) || 20,
      sort: { createdAt: -1 }
    })

    return rs

  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error', message: error.message })
  }
})
