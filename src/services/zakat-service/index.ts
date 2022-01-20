import * as fanuserService from '../fanuser-service'
import { ZakatSubuh } from '../../config/db'
import { FanuserModel, ZakatSubuhModel } from '../../types/model'
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
async function upsertZakatByFanuserId(
  fanuserId: number,
  zakatValue: number,
  operator: '-' | '+' = '+'
) {
  const zakatSubuh = await getZakatSubuhByFanuserId(fanuserId)
  if (!zakatSubuh) {
    return await ZakatSubuh.create({ fanuserId, total: zakatValue })
  }

  const newTotal =
    operator === '+'
      ? zakatSubuh.total + zakatValue
      : zakatSubuh.total - zakatValue
  Object.assign(zakatSubuh, { total: newTotal })
  await zakatSubuh.save()
  return zakatSubuh
}

class ZakatSubuhService {
  private telegramId: string
  private fanuser?: FanuserModel

  constructor(telegramId: string) {
    this.telegramId = telegramId
  }

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
      throw new Error(`Error get user from telegramId: ${error}`)
    }
  }

  /**
   * Get updated zakat
   */
  async getCurrentZakat() {
    if (!this.fanuser) {
      throw new TelegramError('User not found, please initialize')
    }

    const zakatSubuh = await getZakatSubuhByFanuserId(this.fanuser.id)
    if (!zakatSubuh) {
      throw new TelegramError('Zakat subuh data not found')
    }

    return zakatSubuh
  }

  /**
   * Increase zakat value in database
   */
  async increaseZakat(zakatValue: number) {
    if (!this.fanuser) {
      throw new TelegramError('User not found, please initialize')
    }
    return upsertZakatByFanuserId(this.fanuser.id, zakatValue, '+')
  }
}

export { ZakatSubuhService }
