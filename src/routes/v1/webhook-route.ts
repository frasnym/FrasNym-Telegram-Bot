import { Router } from 'express'
import { webhookController } from '../../controllers'

const router = Router()

router.post('/sentourybot', webhookController.frasnymBotWebhook)

export { router as webhookRoute }
