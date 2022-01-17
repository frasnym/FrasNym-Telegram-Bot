import envVars from '../../config/envVars'
import { logger } from '../../config/logger'
import { TelegramMessage } from '../../types/rest-api'
import { GROUP_CHAT_ID } from '../../utils/constant'
import { telegram as axiosTelegramService } from '../axios-service'

/**
 * Handle received message
 */
export async function handleReceivedMessage(
  message: TelegramMessage
): Promise<void> {
  if (!message) {
    logger.warn(`Invalid message: ${JSON.stringify(message)}`)
  }

  try {
    const loweredCaseMessage = message.text.toLowerCase()

    if (loweredCaseMessage.indexOf('hellobot') >= 0) {
      const chatResponse = `Hello ${message.from.first_name} 👋\nHow are you today?`
      await axiosTelegramService.sendMessage(
        envVars.telegramBot.sentry,
        message.chat.id,
        chatResponse
      )
    } else {
      logger.warn(`Unhandled message signal: ${loweredCaseMessage}`)
    }
  } catch (err) {
    logger.error(`Error while sending message: ${JSON.stringify(err)}`)
  }
}
