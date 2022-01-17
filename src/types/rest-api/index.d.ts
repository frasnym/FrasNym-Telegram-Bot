/**
 * Define all of variable available inside of .env file
 */
export interface EnvVars {
  TZ: string
  NODE_ENV: string
  PORT: number
  TELEGRAM_LOGGERBOT_TOKEN: string
  TELEGRAM_SENTRYBOT_TOKEN: string
  TELEGRAM_ZAKATSUBUHBOT_TOKEN: string
  POSTGRES_URL: string
}

/**
 * Define telegram message
 */
export interface TelegramMessage {
  message_id: number
  from: {
    id: number
    is_bot: boolean
    first_name: string
    last_name: string
    username: string
    language_code: string
  }
  chat: {
    id: string
    first_name: string
    last_name: string
    username: string
    type: string
  }
  date: number
  text: string
}

/**
 * One of: year, quarter, month, week, day, hour, minute, second
 * Used to work with dateAdd utils
 */
export type DateInterval =
  | 'year'
  | 'quarter'
  | 'month'
  | 'week'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second'
