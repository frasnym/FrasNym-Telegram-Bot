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
      )} 👍\n\nSemoga berkah yaa..`
    )
    logger.info(
      `[SedekahSubuhBot] [${ctx.chat.id}] Successfully sendZakatInformationToUser`
    )
  } catch (error) {
    if (error instanceof TelegramError) {
      ctx.reply(error.message)
    } else {
      logger.error(error)
      ctx.reply(
        `Error while sending zakat information: ${error}`
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
      ctx.reply(`Error while increase zakat: ${error}`)
    }
  }
}

export async function increaseZakatWithRandom(
  ctx: MatchedContext<Context<tg.Update>, 'text'>
) {
  try {
    const zakatSubuhService = new zakatService.ZakatSubuhService(
      ctx.chat.id.toString()
    )
    await zakatSubuhService.initializeFanuser()

    const sedekahSubuh = await zakatSubuhService.getCurrentZakat()
    if (!sedekahSubuh.random_seed) {
      ctx.replyWithMarkdown('Anda belum mempunyai nilai acak sedekah.\nAnda dapat mengubah nilai acak dengan cara: `/setrandomalms`')
      return
    }

    const randomSeed = sedekahSubuh.random_seed.split(',')
    const random = Math.floor(Math.random() * randomSeed.length);
    const newZakatValue = parseInt(randomSeed[random])
    if (!newZakatValue) {
      throw new TelegramError(`Invalid zakat value: ${randomSeed[random]}`)
    }

    const zakatSubuh = await zakatSubuhService.increaseZakat(newZakatValue)

    ctx.reply(
      `Selamat, jumlah total sedekah Anda sudah diperbaharui 🎉\nHasil acak: Rp ${numberWithCommas(
        newZakatValue
      )}\nTotal: Rp ${numberWithCommas(zakatSubuh.total)}`
    )
    logger.info(
      `[SedekahSubuhBot] [${ctx.chat.id}] Successfully increaseZakatWithRandom`
    )
  } catch (error) {
    if (error instanceof TelegramError) {
      ctx.reply(error.message)
    } else {
      ctx.reply(`Error while increaseZakatWithRandom: ${error}`)
    }
  }
}

export async function updateRandomSeedValue(
  ctx: MatchedContext<Context<tg.Update>, 'text'>
) {
  try {
    const commandExample = '/setrandomalms 100,200,300';
    const randomSeedPlain = (ctx.message.text).replace('/setrandomalms', '')
    if (!randomSeedPlain) {
      ctx.replyWithMarkdown(`Mohon untuk mencantumkan nilai acak\n\nContoh: \`${commandExample}\``)
      return
    }

    let stopNow = false
    const newRandomSeed: number[] = []

    // Check every value provided
    const randomSeedArray = randomSeedPlain.split(',')
    randomSeedArray.every((rnd, index) => {
      // The every() function behaves exactly like forEach(),
      // except it stops iterating through the array whenever the callback function returns a falsy value.

      const anyNotDigitRemoved = rnd.replace(/\D+/g, '')
      const parsedToInt = parseInt(anyNotDigitRemoved)
      if (!parsedToInt) {
        ctx.replyWithMarkdown(`Nilai ke-${index + 1} (${rnd}) harus berupa angka\n\nContoh: \`${commandExample}\``)
        stopNow = true
        return false
      }

      newRandomSeed.push(parsedToInt)
      return true
    });

    if (stopNow) {
      return
    }

    // Initialize zakat subuh
    const zakatSubuhService = new zakatService.ZakatSubuhService(
      ctx.chat.id.toString()
    )
    await zakatSubuhService.initializeFanuser()

    // Update table
    const newRandomSeedJoined = newRandomSeed.join(',')
    await zakatSubuhService.updateZakatSubuhTable({ random_seed: newRandomSeedJoined })

    ctx.reply(
      `Perubahan nilai acak berhasil 🙌\n\nNilai acak sekarang: ${newRandomSeedJoined}`)
    logger.info(
      `[SedekahSubuhBot] [${ctx.chat.id}] Successfully updateRandomSeedValue`
    )
  } catch (error) {
    if (error instanceof TelegramError) {
      ctx.reply(error.message)
    } else {
      ctx.reply(`Error while updateRandomSeedValue: ${error}`)
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
        `Error while greeting: ${error}`
      )
    }
  }
}