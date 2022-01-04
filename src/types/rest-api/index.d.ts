/**
 * Define all of variable available inside of .env file
 */
export interface EnvVars {
  TZ: string
  NODE_ENV: string
  PORT: number
  TELEGRAM_BOT_TOKEN: string
}

/**
 * Define telegram message
 */
export interface TelegramMessage {
  text: string
  chat: {
    id: number
  }
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
