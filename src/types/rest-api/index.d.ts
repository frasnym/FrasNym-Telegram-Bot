/**
 * Define all of variable available inside of .env file
 */
export interface EnvVars {
  TZ: string
  NODE_ENV: string
  BASE_PATH: string
  PORT: number
  TELEGRAM_LOGGERBOT_TOKEN: string
  TELEGRAM_SENTRYBOT_TOKEN: string
  TELEGRAM_ZAKATSUBUHBOT_TOKEN: string
  POSTGRES_URL: string
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
