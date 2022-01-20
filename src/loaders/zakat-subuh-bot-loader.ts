import { Telegraf, Context } from 'telegraf'
import * as tg from 'typegram'
import envVars from '../config/envVars'
import { logger } from '../config/logger'
import { sendZakatInformationToUser } from '../controllers/zakat-subuh-controller'

export default class ZakatSubuhBot {
  private bot: Telegraf<Context<tg.Update>>
  private botSecretPath?: string

  constructor() {
    this.bot = this.getBotInstance()
  }

  getBotInstance() {
    if (!this.bot) this.initializeBot()
    return this.bot
  }

  getBotSecretPath() {
    if (!this.bot) this.initializeBot()
    return this.botSecretPath
  }

  initializeBot() {
    if (this.bot) return
    const newBot = new Telegraf(envVars.telegramBot.zakatSubuh)

    newBot.command('info', sendZakatInformationToUser)

    this.botSecretPath = `/${newBot.secretPathComponent()}`
    newBot.telegram.setWebhook(`${envVars.basePath}${this.botSecretPath}`)

    // Enable graceful stop
    process.once('SIGINT', () => newBot.stop('SIGINT'))
    process.once('SIGTERM', () => newBot.stop('SIGTERM'))

    this.bot = newBot
    logger.info(`[ZakatSubuhBot-${this.botSecretPath}] Sucessfully initialized`)
  }
}
