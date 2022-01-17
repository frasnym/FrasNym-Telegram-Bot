import axios from 'axios'
import { logger } from '../../config/logger'

/**
 * Send telegram message
 * @param from bot token
 * @param to chat id
 * @param message
 */
export async function sendMessage(
  from: string,
  to: string,
  message: string
): Promise<void> {
  try {
    const res = await axios.get(
      `https://api.telegram.org/${from}/sendMessage?chat_id=${to}&text=${encodeURIComponent(
        message
      )}`
    )
    logger.info(`Success sending message: ${JSON.stringify(res.data)}`)
  } catch (error) {
    logger.error(`Error while sending message: ${JSON.stringify(error)}`)
  }
}
