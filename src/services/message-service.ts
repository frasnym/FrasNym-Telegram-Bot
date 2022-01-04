import axios from 'axios'
import envVars from '../config/envVars'
import { logger } from '../config/logger'
import { TelegramMessage } from '../types/rest-api'

/**
 * Greet me
 */
export async function greetMe(message: TelegramMessage): Promise<void> {
  if (!message || message.text.toLowerCase().indexOf('greetme') < 0) {
    logger.error(`Invalid message: ${JSON.stringify(message)}`)
  }

  try {
    const res = await axios.post(
      `https://api.telegram.org/${envVars.telegramBot.token}/sendMessage`,
      {
        chat_id: message.chat.id,
        text: 'Hello there!!'
      }
    )
    logger.info(`Success sending message: ${JSON.stringify(res)}`)
  } catch (err) {
    logger.error(`Error while sending message: ${JSON.stringify(err)}`)
  }
}
