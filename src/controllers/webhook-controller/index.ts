import { webhookService } from '../../services'
import { catchAsync } from '../../utils/catch-async'
import { SuccessResponse } from '../../utils/jsend'

export const sentryBotWebhook = catchAsync(async function (req, res) {
  await webhookService.sentryBot.handleReceivedMessage(req.body.message)
  res.send(new SuccessResponse().serializeResponse())
})

export const zakatSubuhBotWebhook = catchAsync(async function (req, res) {
  await webhookService.zakatSubuhBot.handleReceivedMessage(req.body.message)
  res.send(new SuccessResponse().serializeResponse())
})
