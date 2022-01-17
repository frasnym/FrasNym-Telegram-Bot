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
  to: number,
  message: string
): Promise<void> {
  axios
    .get(
      `https://api.telegram.org/${from}/sendMessage?chat_id=${to}&text=${encodeURIComponent(
        message
      )}`
    )
    .then(function (response) {
      logger.info(`Success sending message: ${JSON.stringify(response.data)}`)
    })
    .catch(function (error) {
      logger.error(`Error while sending message: ${JSON.stringify(error)}`)
    })
}
