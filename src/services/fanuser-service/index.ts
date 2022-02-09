import { Fanuser } from '../../config/db'
import { FanuserModel } from '../../types/model'

/**
 * Get user by telegram id
 */
export function getUserBytelegramId(
  telegramId: string
): Promise<FanuserModel | null> {
  return Fanuser.findOne({
    where: { telegram_id: telegramId.toString() }
  })
}
