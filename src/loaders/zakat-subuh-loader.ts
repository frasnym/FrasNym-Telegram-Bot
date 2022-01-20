import { Telegraf } from 'telegraf'
import envVars from '../config/envVars'
import { TelegramError } from '../errors/telegram-error'
import { zakatService } from '../services'
import { formatToDateID } from '../utils/date'
import { numberWithCommas } from '../utils/number'

export default function zakatSubuhBotLoader() {
  const zakatSubuhBot = new Telegraf(envVars.telegramBot.zakatSubuhTokenOnly)
  zakatSubuhBot.command('info', async function (ctx) {
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
  })
  zakatSubuhBot.launch()

  // Enable graceful stop
  process.once('SIGINT', () => zakatSubuhBot.stop('SIGINT'))
  process.once('SIGTERM', () => zakatSubuhBot.stop('SIGTERM'))
}
