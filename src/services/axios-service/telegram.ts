import axios from 'axios'
import envVars from '../../config/envVars'
import { logger } from '../../config/logger'

/**
 * Send telegram message
 */
export async function sendMessage(
  chatId: number,
  message: string
): Promise<void> {
  try {
    const res = await axios.get(
      `https://api.telegram.org/${
        envVars.telegramBot.token
      }/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`
    )
    logger.info(`Success sending message: ${JSON.stringify(res)}`)
  } catch (err) {
    logger.error(`Error while sending message: ${JSON.stringify(err)}`)
  }
}
