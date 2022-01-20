import { Context, NarrowedContext, Types } from 'telegraf'
import * as tg from 'typegram'
import { logger } from '../../../config/logger'
import { TelegramError } from '../../../errors/telegram-error'
import { zakatService } from '../../../services'
import { formatToDateID } from '../../../utils/date'
import { numberWithCommas } from '../../../utils/number'

declare type MatchedContext<
  C extends Context,
  T extends Types.UpdateType | Types.MessageSubType
> = NarrowedContext<C, Types.MountMap[T]>

export async function sendZakatInformationToUser(
  ctx: MatchedContext<Context<tg.Update>, 'text'>
) {
  try {
    const zakatSubuhService = new zakatService.ZakatSubuhService(
      ctx.chat.id.toString()
    )
    await zakatSubuhService.initializeFanuser()
    const zakatSubuh = await zakatSubuhService.getCurrentZakat()

    ctx.reply(
      `Total Zakat: IDR ${numberWithCommas(
        zakatSubuh.total
      )} 👍\nLast Updated: ${formatToDateID(zakatSubuh.updatedAt!)}`
    )
    logger.info(
      `[ZakatSubuhBot] [${ctx.chat.id}] Successfully sendZakatInformationToUser`
    )
  } catch (error) {
    if (error instanceof TelegramError) {
      ctx.reply(error.message)
    } else {
      ctx.reply(
        `Error while sending zakat information: ${JSON.stringify(error)}`
      )
    }
  }
}

export async function increaseZakatBySpin(
  ctx: MatchedContext<Context<tg.Update>, 'photo'>
) {
  try {
    const loweredCaseText =
      typeof ctx.message.caption === 'string'
        ? ctx.message.caption.toLowerCase()
        : null
    if (!loweredCaseText) {
      const errMessage = `Invalid caption message: ${JSON.stringify(
        ctx.message.caption
      )}`
      logger.warn(errMessage)
      throw new TelegramError(errMessage)
    }

    if (loweredCaseText.indexOf('bismillah sedekah subuh') >= 0) {
      const splittedText = loweredCaseText.split(' ')
      const newZakatValue = parseInt(splittedText[2])
      if (!newZakatValue) {
        throw new TelegramError(`Invalid zakat value: ${splittedText[2]}`)
      }

      const zakatSubuhService = new zakatService.ZakatSubuhService(
        ctx.chat.id.toString()
      )
      await zakatSubuhService.initializeFanuser()
      const zakatSubuh = await zakatSubuhService.increaseZakat(newZakatValue)

      ctx.reply(
        `Congratulations, Your zakat has been updated 🎉\nTotal: IDR ${numberWithCommas(
          zakatSubuh.total
        )}`
      )
      logger.info(
        `[ZakatSubuhBot] [${ctx.chat.id}] Successfully increaseZakatBySpin`
      )
    }
  } catch (error) {
    if (error instanceof TelegramError) {
      ctx.reply(error.message)
    } else {
      ctx.reply(`Error while increase zakat: ${JSON.stringify(error)}`)
    }
  }
}
