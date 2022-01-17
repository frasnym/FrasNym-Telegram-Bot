import envVars from '../../config/envVars'
import { axiosService, webhookService } from '../../services'
import { catchAsync } from '../../utils/catch-async'
import { GROUP_CHAT_ID } from '../../utils/constant'
import { SuccessResponse } from '../../utils/jsend'

export const sentryBotWebhook = catchAsync(async function (req, res) {
  // Send message log to FrasNymBotLog Group
  axiosService.telegram.sendMessage(
    envVars.telegramBot.logger,
    GROUP_CHAT_ID.FrasNymBotLog,
    JSON.stringify(req.body)
  )

  await webhookService.handleReceivedMessage(req.body.message)

  res.send(new SuccessResponse().serializeResponse())
})
