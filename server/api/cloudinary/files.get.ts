export default defineEventHandler(async (event) => {
  ensureAuth(event)

  try {
    const query = getQuery(event)
    const { cloudinary } = useCloudinary()

    const maxResults = Number(query.max_results) || 50
    const folderName = String(query.folder || '')

    if (!folderName || folderName.toLowerCase() === 'root') {
      return await cloudinary.api.resources({
        type: 'upload',
        max_results: maxResults
      })
    } else {
      return await cloudinary.api.resources_by_asset_folder(folderName, {
        max_results: maxResults,
        resource_type: 'auto'
      })
    }

  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error.serverError', message: error.message })
  }
})
