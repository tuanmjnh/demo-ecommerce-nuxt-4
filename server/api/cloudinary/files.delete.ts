export default defineEventHandler(async (event) => {
  ensureAuth(event)

  try {
    // const body = await validateBody(event, CloudinaryValidation.deleteFile)
    const body = await readBody(event)
    const { cloudinary } = useCloudinary()
    await cloudinary.api.delete_resources([body.publicId])

    return true

  } catch (error: any) {
    // if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'error', message: error.message })
  }
})
