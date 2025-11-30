export default defineNitroPlugin(async (nitroApp) => {
  const config = useRuntimeConfig()

  try {
    // Get priority from environment variable, fallback to localhost
    const mongodbUri = config.mongodbUri;
    const dbName = config.mongodbName;
    // console.log('mongodbUri', mongodbUri)
    // console.log('dbName', dbName)
    // Connect DB
    await connectToMongoDB(mongodbUri, dbName);

    // --- WARNING WITH SEED DATABASE ---
    // On Vercel, the function can restart (cold start) many times.
    // If the seedDatabase() function does not check carefully whether the data already exists,
    // it will create duplicate data continuously. Make sure your seed function is "idempotent".
    // if (process.env.NODE_ENV === 'development') {
    // await seedDatabase();
    // }

    // Hook to close connection when server is shut down (Useful for local dev, less useful on Serverless but still recommended)
    nitroApp.hooks.hook('close', async () => {
      await disconnectMongoDB();
    });

  } catch (e) {
    console.error('Nitro Plugin Error:', e);
  }
})