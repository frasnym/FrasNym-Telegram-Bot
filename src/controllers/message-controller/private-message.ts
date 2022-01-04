import { messageService } from '../../services'
import { catchAsync } from '../../utils/catch-async'
import { SuccessResponse } from '../../utils/jsend'

export const messageToMe = catchAsync(async function (req, res) {
  await messageService.greetMe(req.body.message)
  res.send(new SuccessResponse().serializeResponse())
})
