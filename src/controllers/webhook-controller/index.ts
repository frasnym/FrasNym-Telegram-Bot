import { webhookService } from '../../services'
import { catchAsync } from '../../utils/catch-async'
import { SuccessResponse } from '../../utils/jsend'

export const sentryBotWebhook = catchAsync(async function (req, res) {
  await webhookService.handleReceivedMessage(req.body.message)
  res.send(new SuccessResponse().serializeResponse())
})

export const zakatSubuhBotWebhook = catchAsync(async function (req, res) {
  await webhookService.zakatSubuh.handleReceivedMessage(req.body.message)
  res.send(new SuccessResponse().serializeResponse())
})
