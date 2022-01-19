import * as fanuserService from '../fanuser-service'
import * as axiosService from '../axios-service'
import envVars from '../../config/envVars'
import { ZakatSubuh } from '../../config/db'
import { FanuserModel, ZakatSubuhModel } from '../../types/model'
import { numberWithCommas } from '../../utils/number'
import { TelegramError } from '../../errors/telegram-error'

/**
 * Get ZakatSubuh by fanusedId
 */
function getZakatSubuhByFanuserId(
  fanuserId: number
): Promise<ZakatSubuhModel | null> {
  return ZakatSubuh.findOne({
    where: { fanuserId }
  })
}

/**
 * Upsert Zakat By FanuserId
 */
async function upsertZakatByFanuserId(fanuserId: number, zakatValue: number) {
  const zakatSubuh = await getZakatSubuhByFanuserId(fanuserId)
  if (!zakatSubuh) {
    return await ZakatSubuh.create({ fanuserId, total: zakatValue })
  }

  Object.assign(zakatSubuh, { total: zakatSubuh.total + zakatValue })
  await zakatSubuh.save()
  return zakatSubuh
}

class ZakatSubuhService {
  private fanuser?: FanuserModel
  private zakatSubuhAxios = new axiosService.AxiosTelegram(
    envVars.telegramBot.zakatSubuh
  )

  constructor(private telegramId: string) {}

  /**
   * Initialize Fanuser from provided TelegramId
   */
  async initializeFanuser() {
    try {
      const fanuser = await fanuserService.getUserByTelegramId(this.telegramId)
      if (!fanuser) {
        throw new TelegramError('User not found, please register')
      }

      this.fanuser = fanuser
    } catch (error) {
      throw new Error(
        `Error get user from telegramId: ${JSON.stringify(error)}`
      )
    }
  }

  /**
   * Update zakat value in database and send updated zakat to user
   */
  async updateZakat(zakatValue: number) {
    if (!this.fanuser) {
      throw new TelegramError('User not found, please initialize')
    }

    const zakatSubuh = await upsertZakatByFanuserId(this.fanuser.id, zakatValue)

    this.zakatSubuhAxios.sendMessage(
      this.telegramId,
      `Congratulations, Your zakat has been updated 🎉\nTotal: IDR ${numberWithCommas(
        zakatSubuh.total
      )}`
    )
  }

  /**
   * Send updated zakat to user
   */
  async sendCurrentZakat() {
    if (!this.fanuser) {
      throw new TelegramError('User not found, please initialize')
    }

    const zakatSubuh = await getZakatSubuhByFanuserId(this.fanuser.id)
    if (!zakatSubuh) {
      throw new TelegramError('Zakat subuh data not found')
    }

    const formattedDate = new Intl.DateTimeFormat('id', {
      dateStyle: 'full',
      timeStyle: 'long',
      timeZone: 'Asia/Makassar'
    }).format(new Date(zakatSubuh.updatedAt!))

    this.zakatSubuhAxios.sendMessage(
      this.telegramId,
      `Total Zakat: IDR ${numberWithCommas(
        zakatSubuh.total
      )}\nLast Updated: ${formattedDate}`
    )
  }
}

export { ZakatSubuhService }
