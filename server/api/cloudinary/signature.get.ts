import crypto from 'crypto'

export default defineEventHandler(async (event) => {
  ensureAuth(event)
  const rs = { message: 'success', status: true, data: null }

  try {
    const query = getQuery(event)
    const folder = query.folder

    const { preset, config } = useCloudinary()
    const apiSecret = useRuntimeConfig().cloudinaryApiSecret

    const timestamp = Math.round(Date.now() / 1000)

    // Signature generation
    const paramsToSign = `${folder ? `folder=${folder}&` : ''}timestamp=${timestamp}&upload_preset=${preset}`

    const signature = crypto
      .createHash('sha1')
      .update(paramsToSign + apiSecret)
      .digest('hex')

    return {
      message: 'success',
      status: true,
      timestamp,
      signature,
      cloudName: config.cloudName,
      apiKey: config.apiKey,
      preset
    }

  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: 'error.signatureFailed', message: error.message })
  }
})
