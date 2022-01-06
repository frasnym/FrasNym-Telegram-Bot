import { logger } from '../../config/logger'
import { TelegramMessage } from '../../types/rest-api'
import { telegram as axiosTelegramService } from '../axios-service'

/**
 * Handle received message
 */
export async function handleReceivedMessage(
  message: TelegramMessage
): Promise<void> {
  if (!message) {
    logger.warning(`Invalid message: ${JSON.stringify(message)}`)
  }

  try {
    const loweredCaseMessage = message.text.toLowerCase()

    if (loweredCaseMessage.indexOf('hellobot') < 0) {
      const chatResponse = encodeURIComponent(
        `Hello ${message.from.first_name} 👋\nHow are you today?`
      )
      await axiosTelegramService.sendMessage(message.chat.id, chatResponse)
    } else {
      logger.warning(`Unhandled message signal: ${loweredCaseMessage}`)
    }
  } catch (err) {
    logger.error(`Error while sending message: ${JSON.stringify(err)}`)
  }
}
