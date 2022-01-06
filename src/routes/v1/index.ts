import { Router } from 'express'
import { webhookRoute } from './webhook-route'

const router = Router()

const defaultRoutes = [
  {
    path: '/webhook',
    route: webhookRoute
  }
]

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route)
})

export { router }
