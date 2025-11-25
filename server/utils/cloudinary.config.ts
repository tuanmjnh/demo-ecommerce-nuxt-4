import { v2 as _cloudinary } from 'cloudinary'

/**
 * Initialize and return the Cloudinary instance with configuration
 */
export const useCloudinary = () => {
  const config = useRuntimeConfig()

  // Configure Cloudinary with environment variables
  _cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
  })

  return {
    cloudinary: _cloudinary,
    preset: config.cloudinaryUploadPreset as string,
    config: {
      cloudName: config.cloudinaryCloudName,
      apiKey: config.cloudinaryApiKey
    }
  }
}
