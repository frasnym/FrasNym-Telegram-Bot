import axios from 'axios'
import envVars from '../config/envVars'
import { logger } from '../config/logger'
import { TelegramMessage } from '../types/rest-api'

/**
 * Greet me
 */
export function greetMe(message: TelegramMessage): void {
  if (!message || message.text.toLowerCase().indexOf('greetme') < 0) {
    logger.error(`Invalid message: ${JSON.stringify(message)}`)
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
      logger.error(`Error while sending message: ${JSON.stringify(err)}`)
      // throw new ErrorResponse(500, 'Error while sending message', err)
    })
}
