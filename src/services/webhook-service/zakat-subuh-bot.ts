import { logger } from '../../config/logger'
import { TelegramMessage } from '../../types/rest-api'
import * as zakatService from '../zakat-service'
import * as axiosService from '../axios-service'
import envVars from '../../config/envVars'

function sendUnableToHandleMessage(telegramId: string) {
  axiosService.telegram.sendMessage(
    envVars.telegramBot.zakatSubuh,
    telegramId,
    'Sorry, unable to handle your message'
  )
}

async function handleCaption(text: string, telegramId: string) {
  const loweredCaseText = typeof text === 'string' ? text.toLowerCase() : null
  if (!loweredCaseText) {
    logger.warn(`Invalid message: ${JSON.stringify(text)}`)
    return
  }

  if (loweredCaseText.indexOf('bismillah sedekah subuh') >= 0) {
    const splittedText = loweredCaseText.split(' ')
    const newZakatValue = parseInt(splittedText[2])
    if (!newZakatValue) throw new Error()

    await zakatService.updateZakatByTelegramId(telegramId, newZakatValue)
  } else throw new Error()
}

async function handleText(text: string, telegramId: string) {
  const loweredCaseText = typeof text === 'string' ? text.toLowerCase() : null
  if (!loweredCaseText) {
    logger.warn(`Invalid message: ${JSON.stringify(text)}`)
    return
  }

  if (loweredCaseText.indexOf('/info') >= 0) {
    await zakatService.sendCurrentZakatByTelegramId(telegramId)
  } else throw new Error()
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
    if (message.caption) {
      await handleCaption(message.caption, message.chat.id)
    }

    if (message.text) {
      await handleText(message.text, message.chat.id)
    }
  } catch (err) {
    sendUnableToHandleMessage(message.chat.id)
  }
}
