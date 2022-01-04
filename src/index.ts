import app from './app'
import { logger } from './config/logger'
import envVars from './config/envVars'

const PORT = envVars.port

const server = app
  .listen(PORT, function () {
    logger.info(`Application is up and running on port ${PORT}`)
  })
  .on('error', function (err) {
    logger.error(`Failed to initialize app: ${err.message}`)
  })

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed')
      process.exit(1)
    })
  } else {
    process.exit(1)
  }
}

const unexpectedErrorHandler = (error: Error) => {
  logger.error(error)
  exitHandler()
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)

process.on('SIGTERM', () => {
  logger.info('SIGTERM received')
  if (server) {
    server.close()
  }
})
