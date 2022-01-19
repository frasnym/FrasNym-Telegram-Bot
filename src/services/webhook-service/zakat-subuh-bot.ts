import { logger } from '../../config/logger'
import { TelegramMessage } from '../../types/rest-api'
import * as zakatService from '../zakat-service'
import envVars from '../../config/envVars'
import {
  TelegramError,
  UnhandledMessageResponse
} from '../../errors/telegram-error'

/**
 * Handle caption message from telegram message
 */
async function handleCaption(text: string, telegramId: string) {
  const loweredCaseText = typeof text === 'string' ? text.toLowerCase() : null
  if (!loweredCaseText) {
    const errMessage = `Invalid caption message: ${JSON.stringify(text)}`
    logger.warn(errMessage)
    throw new TelegramError(errMessage)
  }

  if (loweredCaseText.indexOf('bismillah sedekah subuh') >= 0) {
    const splittedText = loweredCaseText.split(' ')
    const newZakatValue = parseInt(splittedText[2])
    if (!newZakatValue) {
      throw new TelegramError(`Invalid zakat value: ${splittedText[2]}`)
    }

    try {
      const zakatSubuhService = new zakatService.ZakatSubuhService(telegramId)
      await zakatSubuhService.initializeFanuser()
      await zakatSubuhService.updateZakat(newZakatValue)
    } catch (error) {
      if (error instanceof TelegramError) {
        throw new TelegramError(error.message)
      } else {
        throw new Error(
          `Error while handling caption message: ${JSON.stringify(error)}`
        )
      }
    }
  }
}

/**
 * Handle text message from telegram message
 */
async function handleText(text: string, telegramId: string) {
  const loweredCaseText = typeof text === 'string' ? text.toLowerCase() : null
  if (!loweredCaseText) {
    const errMessage = `Invalid text message: ${JSON.stringify(text)}`
    logger.warn(errMessage)
    throw new TelegramError(errMessage)
  }

  if (loweredCaseText.indexOf('/info') >= 0) {
    try {
      const zakatSubuhService = new zakatService.ZakatSubuhService(telegramId)
      await zakatSubuhService.initializeFanuser()
      await zakatSubuhService.sendCurrentZakat()
    } catch (error) {
      if (error instanceof TelegramError) {
        throw new TelegramError(error.message)
      } else {
        throw new Error(
          `Error while handling text message: ${JSON.stringify(error)}`
        )
      }
    }
  }
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
    if (err instanceof TelegramError) {
      throw new UnhandledMessageResponse(
        envVars.telegramBot.zakatSubuh,
        message.chat.id,
        err.message
      )
    } else {
      logger.error(
        `Error while handling received message: ${JSON.stringify(err)}`
      )
    }
  }
}
