import express, { Application } from 'express'
import helmet from 'helmet'

import envVars from './config/envVars'
import * as morgan from './config/morgan'
import { errorConverter, errorHandler } from './middlewares/error'
import { router } from './routes/v1'
import { FailResponse } from './utils/jsend'

import { version } from '../package.json'
import ZakatSubuhBot from './loaders/zakat-subuh-bot-loader'
import LoggerBot from './loaders/logger-bot-loader'

const app: Application = express()

// logger middleware
if (envVars.env !== 'test') {
  app.use(morgan.successHandler)
  app.use(morgan.errorHandler)
}

app.use(helmet()) // set security HTTP headers
app.use(express.json()) // parse json request body
app.use(
  express.urlencoded({
    extended: true
  })
) // for parsing application/x-www-form-urlencoded

// Initialize Bot
const zakatSubuhBot = new ZakatSubuhBot()
app.use(
  zakatSubuhBot
    .getBotInstance()
    .webhookCallback(zakatSubuhBot.getBotSecretPath())
)
const loggerBot = new LoggerBot()
app.use(
  loggerBot.getBotInstance().webhookCallback(loggerBot.getBotSecretPath())
)

// Available routes
app.use('/v1', router)

// Exactly base url
app.use(/^[/]{1}$/, (_req, res) => {
  res.send(`FrasNym Telegram Bot version ${version}`)
})

// send back a 404 error for any unknown api request
app.use(/(?<=.{1}).+/, () => {
  throw new FailResponse(404, 'Not found')
})

app.use(errorConverter) // convert error to JSend Error, if needed
app.use(errorHandler) // error handler middleware

export default app
