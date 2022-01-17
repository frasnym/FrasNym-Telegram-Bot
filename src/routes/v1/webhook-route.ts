import { Router } from 'express'
import { webhookController } from '../../controllers'
// import { logToGroup } from '../../middlewares/logger'

const router = Router()

router.post('/sentourybot', webhookController.sentryBotWebhook)
router.post('/zakatsubuhbot', webhookController.zakatSubuhBotWebhook)

export { router as webhookRoute }
