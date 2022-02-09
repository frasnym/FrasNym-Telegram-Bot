import { Context, NarrowedContext, Types } from 'telegraf'
import * as tg from 'typegram'
import { logger } from '../../../config/logger'
import { TelegramError } from '../../../errors/telegram-error'
import { fanuserService, zakatService } from '../../../services'
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
      `Jumlah sedekah Anda adalah: Rp ${numberWithCommas(
        zakatSubuh.total
      )} 👍\nDiubah terakhir pada: ${formatToDateID(
        zakatSubuh.updatedAt!
      )}\n\nSemoga berkah yaa..`
    )
    logger.info(
      `[SedekahSubuhBot] [${ctx.chat.id}] Successfully sendZakatInformationToUser`
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
        `Selamat, jumlah total sedekah Anda sudah diperbaharui 🎉\nTotal: Rp ${numberWithCommas(
          zakatSubuh.total
        )}`
      )
      logger.info(
        `[SedekahSubuhBot] [${ctx.chat.id}] Successfully increaseZakatBySpin`
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

export async function greeting(
  ctx: MatchedContext<Context<tg.Update>, 'text'>
) {
  try {
    let fanuserText = "Sayang sekali, Anda belum terdaftar sebagai furafan 😔"

    const fanuser = await fanuserService.getUserBytelegramId((ctx.from.id).toString())
    if (fanuser) {
      fanuserText = "Selamat, Anda sudah terdaftar pada sistem furafan 🥳"
    }

    ctx.reply(
      `Halo ${ctx.from.first_name} ${ctx.from.last_name} 👋\nTelegramID Anda adalah: ${ctx.from.id}\n\n${fanuserText}`
    )
    logger.info(
      `[SedekahSubuhBot] [${ctx.chat.id}] Successfully greeting`
    )
  } catch (error) {
    if (error instanceof TelegramError) {
      ctx.reply(error.message)
    } else {
      ctx.reply(
        `Error while greeting: ${JSON.stringify(error)}`
      )
    }
  }
}