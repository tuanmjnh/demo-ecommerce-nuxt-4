export default defineEventHandler(async (event) => {
  ensureAuth(event)

  try {
    const folderName = getRouterParam(event, 'folder')
    if (!folderName) {
      throw createError({ statusCode: 400, message: 'Missing folder name' })
    }

    const { cloudinary } = useCloudinary()
    // Note: Folder must be empty to be deleted
    await cloudinary.api.delete_folder(folderName)

    return true

  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'error.deleteFailed', message: error.message })
  }
})
