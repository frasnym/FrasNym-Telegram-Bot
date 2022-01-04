import axios from 'axios'
import envVars from '../config/envVars'
import { logger } from '../config/logger'
import { TelegramMessage } from '../types/rest-api'
import { ErrorResponse, FailResponse } from '../utils/jsend'

/**
 * Greet me
 */
export function greetMe(message: TelegramMessage): void {
  logger.info(JSON.stringify(message))
  if (!message || message.text.toLowerCase().indexOf('greetme') < 0) {
    // throw new FailResponse(400, 'Invalid message', message)
  }

  axios
    .post(`https://api.telegram.org/${envVars.telegramBot.token}/sendMessage`, {
      chat_id: message.chat.id,
      text: 'Hello there!!'
    })
    .then((res) => {
      logger.info(`Success sending message: ${JSON.stringify(res)}`)
    })
    .catch((err) => {
      // throw new ErrorResponse(500, 'Error while sending message', err)
    })
}
