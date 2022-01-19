import { format, createLogger, transports } from 'winston'
import envVars from './envVars'

const enumerateErrorFormat = format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack })
  }
  return info
})

function timezoned() {
  return new Intl.DateTimeFormat('id', {
    dateStyle: 'full',
    timeStyle: 'long',
    timeZone: 'Asia/Makassar'
  }).format(new Date())
}

const logger = createLogger({
  level: envVars.env === 'development' ? 'debug' : 'info',
  format: format.combine(
    format.timestamp({ format: timezoned }),
    enumerateErrorFormat(),
    envVars.env === 'development' ? format.colorize() : format.uncolorize(),
    format.splat(),
    format.printf(
      ({ timestamp, level, message }) => `[${timestamp}] [${level}]: ${message}`
    )
  ),
  transports: [new transports.Console()],
  exitOnError: false
})

export { logger }
