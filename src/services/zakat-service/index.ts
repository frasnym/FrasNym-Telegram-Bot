import * as fanuserService from '../fanuser-service'
import * as axiosService from '../axios-service'
import envVars from '../../config/envVars'
import { ZakatSubuh } from '../../config/db'
import { ZakatSubuhModel } from '../../types/model'
import { numberWithCommas } from '../../utils/number'

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

/**
 * Update zakat value in database and send updated zakat to user
 * @param telegramId
 * @param zakatValue
 */
async function updateZakatByTelegramId(telegramId: string, zakatValue: number) {
  const fanuser = await fanuserService.getUserByTelegramId(telegramId)
  if (!fanuser) {
    await axiosService.telegram.sendMessage(
      envVars.telegramBot.zakatSubuh,
      telegramId,
      'User not found, please register'
    )
    return
  }

  const zakatSubuh = await upsertZakatByFanuserId(fanuser!.id, zakatValue)

  const chatResponse = `Congratulations, Your zakat has been updated 🎉\nTotal: IDR ${numberWithCommas(
    zakatSubuh.total
  )}`
  await axiosService.telegram.sendMessage(
    envVars.telegramBot.zakatSubuh,
    telegramId,
    chatResponse
  )
}

/**
 * Send updated zakat to user
 * @param telegramId
 * @returns
 */
async function sendCurrentZakatByTelegramId(telegramId: string) {
  const fanuser = await fanuserService.getUserByTelegramId(telegramId)
  if (!fanuser) {
    await axiosService.telegram.sendMessage(
      envVars.telegramBot.zakatSubuh,
      telegramId,
      'User not found, please register'
    )
    return
  }

  const zakatSubuh = await getZakatSubuhByFanuserId(fanuser.id)
  if (!zakatSubuh) {
    await axiosService.telegram.sendMessage(
      envVars.telegramBot.zakatSubuh,
      telegramId,
      'Data not found'
    )
    return
  }

  const formattedDate = new Intl.DateTimeFormat('id', {
    dateStyle: 'full',
    timeStyle: 'long'
  }).format(new Date(zakatSubuh.updatedAt!))

  await axiosService.telegram.sendMessage(
    envVars.telegramBot.zakatSubuh,
    telegramId,
    `Total Zakat: IDR ${numberWithCommas(
      zakatSubuh.total
    )}\nLast Updated: ${formattedDate}`
  )
}

export { updateZakatByTelegramId, sendCurrentZakatByTelegramId }
