import { Fanuser } from '../../config/db'
import { FanuserModel } from '../../types/model'

/**
 * Get user by telegram id
 */
export function getUserByTelegramId(
  telegramId: string
): Promise<FanuserModel | null> {
  return Fanuser.findOne({
    where: { telegramId: telegramId.toString() }
  })
}
