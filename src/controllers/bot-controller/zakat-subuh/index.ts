import { Context, NarrowedContext, Types } from 'telegraf'
import * as tg from 'typegram'
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
      )}\nLast Updated: ${formatToDateID(zakatSubuh.updatedAt!)}`
    )
  } catch (error) {
    if (error instanceof TelegramError) {
      ctx.reply(error.message)
    } else {
      ctx.reply(`Error while handling text message: ${JSON.stringify(error)}`)
    }
  }
}
