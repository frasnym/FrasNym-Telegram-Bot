import { logger } from '../../config/logger'
import { TelegramMessage } from '../../types/rest-api'
import * as zakatService from '../zakat-service'
import * as axiosService from '../axios-service'
import envVars from '../../config/envVars'

function sendUnableToHandleMessage(chatId: string) {
  axiosService.telegram.sendMessage(
    envVars.telegramBot.zakatSubuh,
    chatId,
    'Sorry, unable to handle your message'
  )
}

/**
 * Handle zakat subuh message
 */
export async function handleReceivedMessage(
  message: TelegramMessage
): Promise<void> {
  if (!message) {
    logger.warn(`Invalid message: ${JSON.stringify(message)}`)
    return
  }

  try {
    const loweredCaseMessage = message.text.toLowerCase()

    if (loweredCaseMessage.indexOf('bismillah sedekah subuh') >= 0) {
      const splittedText = loweredCaseMessage.split(' ')
      const newZakatValue = parseInt(splittedText[2])
      if (newZakatValue) {
        await zakatService.updateZakatByTelegramId(
          message.chat.id,
          newZakatValue
        )
      } else {
        sendUnableToHandleMessage(message.chat.id)
      }
    } else {
      sendUnableToHandleMessage(message.chat.id)
    }
  } catch (err) {
    logger.error(`Error while handling message: ${JSON.stringify(err)}`)
  }
}
