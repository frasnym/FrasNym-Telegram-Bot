import dotenv from 'dotenv'
import path from 'path'
import Joi from 'joi'
import { EnvVars } from '../types/rest-api'

dotenv.config({
  path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`)
})

const envVarsSchema = Joi.object({
  TZ: Joi.string().default('Asia/Makassar'),
  NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
  PORT: Joi.number().default(3000),
  TELEGRAM_BOT_TOKEN: Joi.string()
}).unknown()

const { value, error } = envVarsSchema.validate(process.env)
if (error) {
  throw new Error(`Environment validation error: ${error.message}`)
}

const envVars: EnvVars = value

export default {
  timezone: envVars.TZ,
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  telegramBot: {
    token: `bot${envVars.TELEGRAM_BOT_TOKEN}`
  }
}
