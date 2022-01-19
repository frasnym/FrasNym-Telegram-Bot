import axios from 'axios'
import http from 'http'
import { logger } from '../../config/logger'

export * as telegram from './telegram'

class AxiosTelegram {
  botToken: string

  constructor(botToken: string) {
    this.botToken = botToken
  }

  async sendMessage(recipient: string, message: string) {
    const apiReqId = `${recipient}_${Date.now()}`
    const url = `https://api.telegram.org/${
      this.botToken
    }/sendMessage?chat_id=${recipient}&text=${encodeURIComponent(message)}`

    try {
      logger.info(`[Axios-${apiReqId}] Request to telegram...`)

      const res = await axios.get(url, {
        timeout: 2000,
        httpAgent: new http.Agent({ keepAlive: true }),
        headers: { 'content-type': 'application/json' }
      })

      logger.info(
        `[Axios-${apiReqId}] Success send message: ${JSON.stringify(res.data)}`
      )
    } catch (error) {
      logger.info(`[Axios-${apiReqId}] Error while sending message: ${error}}`)
    }
  }
}

export { AxiosTelegram }
