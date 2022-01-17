import * as fanuserService from '../fanuser-service'
import { telegram as axiosTelegramService } from '../axios-service'
import envVars from '../../config/envVars'

export async function updateZakatByTelegramId(
  telegramId: string,
  zakatValue: number
) {
  const fanuser = await fanuserService.getUserByTelegramId(telegramId)
  console.log(fanuser)

  if (!fanuser) {
    await axiosTelegramService.sendMessage(
      envVars.telegramBot.zakatSubuh,
      telegramId,
      'User not found, please register'
    )
  }

  console.log('Upsert to zakat', fanuser?.id, zakatValue)
}
