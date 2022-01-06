import axios from 'axios'
import envVars from '../config/envVars'
import { logger } from '../config/logger'
import { TelegramMessage } from '../types/rest-api'

/**
 * Greet me
 */
export async function greetMe(message: TelegramMessage): Promise<void> {
  logger.error(`Logger message: ${JSON.stringify(message)}`)
  if (!message || message.text.toLowerCase().indexOf('greetme') < 0) {
    logger.error(`Invalid message: ${JSON.stringify(message)}`)
  }

  try {
    const chatResponse = encodeURIComponent(
      `Hello ${message.from.first_name} 👋\nHow are you today?\nYou know, I send this message to our private chat..\n\nWell then, cya later!`
    )
    const res = await axios.get(
      `https://api.telegram.org/${envVars.telegramBot.token}/sendMessage?chat_id=${message.chat.id}&text=${chatResponse}`
    )
    logger.info(`Success sending message: ${JSON.stringify(res)}`)
  } catch (err) {
    logger.error(`Error while sending message: ${JSON.stringify(err)}`)
  }
}
