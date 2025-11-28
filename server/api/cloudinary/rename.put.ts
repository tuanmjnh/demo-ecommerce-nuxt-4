export default defineEventHandler(async (event) => {
  ensureAuth(event)

  try {
    // const body = await validateBody(event, CloudinaryValidation.rename)
    const body = await readBody(event)
    const { cloudinary } = useCloudinary()
    await cloudinary.uploader.rename(body.from, body.to, { overwrite: true })

    return true

  } catch (error: any) {
    // if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'error', message: error.message })
  }
})
