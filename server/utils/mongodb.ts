import mongoose from 'mongoose'
// 1. Optimized connection function for Serverless
export const connectToMongoDB = async (mongodbUri: string) => {
  // Check state: 1 = connected, 2 = connecting. If ok, return immediately.
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
    console.log('Using existing database connection');
    return;
  }

  try {
    // Configure strictQuery (avoid warning Mongoose 7+)
    mongoose.set('strictQuery', true);

    await mongoose.connect(mongodbUri, {
      // dbName: 'demo-ecommerce', // Please specify DB name here or in URI

      // --- Important configuration for Vercel/Serverless ---
      bufferCommands: true, // If connection is lost, throw error instead of hanging request
      maxPoolSize: 10, // Keep the number of connections moderate
      serverSelectionTimeoutMS: 5000, // Timeout after 5s if DB connection is not possible (instead of default 30s)
      socketTimeoutMS: 45000, // Keep socket alive for 45s
      // family: 4 // Force IPv4 (avoid errors on some localhost/cloud environments)
    });

    console.log('New database connection established');
  } catch (error) {
    console.error('Database connection error:', error);
    // Throw an error to let Nitro know that the startup failed
    throw error;
  }
}

// 2. Disconnect function (Necessary for use in close hook)
export const disconnectMongoDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect(); // Using disconnect() is more standard than close() 
      console.log('MongoDB connection closed successfully');
    }
  } catch (e) {
    console.error('Error while disconnecting MongoDB:', e);
  }
}

// export const connectMongoDB = async(mongodbUri: string) => {
// // 1. Check if connection is already made to avoid connection overlap
// if (mongoose.connection?.readyState === 1) {
// console.info('MongoDB is already connected.')
// return
// }

// // If connection is in progress (state = 2), wait a bit and return
// if (mongoose.connection?.readyState === 2) {
// console.info('MongoDB is connecting...')
// return
// }

// try {
// // Configure strictQuery to avoid warnings from new Mongoose version
// mongoose.set('strictQuery', true)

// await mongoose.connect(mongodbUri, {
// // Limit pool size low in Dev environment to avoid connection overload
// maxPoolSize: 10,
// serverSelectionTimeoutMS: 5000, // Faster timeout if error
// socketTimeoutMS: 45000, // Keep socket alive a little longer
// family: 4 // Force IPv4 if using localhost (avoid error ::1)
// })
// console.info('Connected to MongoDB successfully')

// // Remove old listener to avoid duplicate log
// mongoose.connection.removeAllListeners('error')
// mongoose.connection.removeAllListeners('disconnected')

// // 2. Only listen to event once (avoid memory leak when reloading a lot)
// // Remove old listeners before assigning new ones (if needed)
// mongoose.connection.removeAllListeners('error')
// mongoose.connection.removeAllListeners('disconnected')

// mongoose.connection.on('error', (err) => {
// console.error('MongoDB connection error:', err)
// })

// mongoose.connection.on('disconnected', () => {
// // Just log warn instead of treating it as a fatal error in Dev
// console.warn('MongoDB disconnected')
// })

// } catch (e) {
// console.error('Failed to connect to MongoDB:', e)
// throw e
// }
// }

// // Disconnect function
// export const disconnectMongoDB = async () => {
// try {
// if (mongoose.connection?.readyState !== 0) {
// await mongoose.connection.close()
// console.log('MongoDB connection closed successfully')
// }
// } catch (e) {
// console.error('Error while disconnecting MongoDB:', e)
// }
// }