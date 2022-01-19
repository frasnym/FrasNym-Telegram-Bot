import { Router } from 'express'
import { webhookController } from '../../controllers'
import { logToGroup } from '../../middlewares/logger'

const router = Router()

router.post('/sentourybot', webhookController.sentryBotWebhook)
router.post('/zakatsubuhbot', webhookController.zakatSubuhBotWebhook)
router.post('/loggorubot', logToGroup(), webhookController.loggerBotWebhook)

export { router as webhookRoute }
