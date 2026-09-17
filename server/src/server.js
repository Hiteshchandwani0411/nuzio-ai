import mongoose from 'mongoose'
import app from './app.js'
import config from './config/index.js'

async function startServer() {
  try {
    await mongoose.connect(config.mongoUri)
    console.log('MongoDB connected')
    app.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()