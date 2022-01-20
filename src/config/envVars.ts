import dotenv from 'dotenv'
import path from 'path'
import Joi from 'joi'
import { EnvVars } from '../types/rest-api'

dotenv.config({
  path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`)
})

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
  PORT: Joi.number().default(3000),
  TELEGRAM_LOGGERBOT_TOKEN: Joi.string().description(
    'Telegram LoggerBot Token'
  ),
  TELEGRAM_SENTRYBOT_TOKEN: Joi.string().description(
    'Telegram SentryBot Token'
  ),
  TELEGRAM_ZAKATSUBUHBOT_TOKEN: Joi.string().description(
    'Telegram ZakatSubuhBot Token'
  ),
  POSTGRES_URL: Joi.string().required().description('PostgreSQL url')
}).unknown()

const { value, error } = envVarsSchema.validate(process.env)
if (error) {
  throw new Error(`Environment validation error: ${error.message}`)
}

const envVars: EnvVars = value

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  telegramBot: {
    logger: `bot${envVars.TELEGRAM_LOGGERBOT_TOKEN}`,
    sentry: `bot${envVars.TELEGRAM_SENTRYBOT_TOKEN}`,
    zakatSubuh: `bot${envVars.TELEGRAM_ZAKATSUBUHBOT_TOKEN}`,
    zakatSubuhTokenOnly: envVars.TELEGRAM_ZAKATSUBUHBOT_TOKEN
  },
  postgres: {
    url: envVars.POSTGRES_URL
  }
}
