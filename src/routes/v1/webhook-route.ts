import { Router } from 'express'
import { webhookController } from '../../controllers'

const router = Router()

router.post('/frasnymbot', webhookController.frasnymBotWebhook)

export { router as webhookRoute }
