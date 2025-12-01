export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const mongodbUri = config.mongodbUri
  const dbName = config.mongodbName

  if (mongodbUri) {
    await connectToMongoDB(mongodbUri, dbName)
  }
})
