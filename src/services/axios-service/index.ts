import axios from 'axios'
import { logger } from '../../config/logger'

export * as telegram from './telegram'

class AxiosTelegram {
  botToken: string

  constructor(botToken: string) {
    this.botToken = botToken
  }

  async sendMessage(recipient: string, message: string) {
    const sendAxiosId = `${recipient}_${Date.now()}`

    try {
      logger.info(`[Axios-${sendAxiosId}] Request to telegram...`)

      const res = await axios.get(
        `https://api.telegram.org/${
          this.botToken
        }/sendMessage?chat_id=${recipient}&text=${encodeURIComponent(message)}`
      )

      logger.info(
        `[Axios-${sendAxiosId}] Success send message: ${JSON.stringify(
          res.data
        )}`
      )
    } catch (error) {
      logger.info(
        `[Axios-${sendAxiosId}] Error while sending message: ${JSON.stringify(
          error
        )}`
      )
    }
  }
}

export { AxiosTelegram }
