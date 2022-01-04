import { Router } from 'express'
import { messageController } from '../../controllers'
import { validate } from '../../middlewares/validate'
import { messageSchema } from '../../validations'

const router = Router()

router.post(
  '/private',
  // validate(messageSchema.newMessageToMe),
  messageController.privateMessage.messageToMe
)

export { router as messageRoute }
