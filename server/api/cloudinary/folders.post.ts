// CloudinaryValidation is auto-imported

export default defineEventHandler(async (event) => {
  ensureAuth(event)

  try {
    // Validate Body
    // const body = await validateBody(event, CloudinaryValidation.createFolder)
    const body = await readBody(event)
    const { cloudinary } = useCloudinary()
    await cloudinary.api.create_folder(body.name)

    return true

  } catch (error: any) {
    // if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'error', message: error.message })
  }
})
