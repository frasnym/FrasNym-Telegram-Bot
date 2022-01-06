import { axiosService, webhookService } from '../../services'
import { catchAsync } from '../../utils/catch-async'
import { GROUP_CHAT_ID } from '../../utils/constant'
import { SuccessResponse } from '../../utils/jsend'

export const frasnymBotWebhook = catchAsync(async function (req, res) {
  // Send message log to FrasNymBotLogger
  axiosService.telegram.sendMessage(
    GROUP_CHAT_ID.FrasNymBotLogger,
    JSON.stringify(req.body)
  )

  await webhookService.handleReceivedMessage(req.body.message)

  res.send(new SuccessResponse().serializeResponse())
})
