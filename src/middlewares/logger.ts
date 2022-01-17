import { NextFunction, Request, RequestHandler, Response } from 'express'
import envVars from '../config/envVars'
import { axiosService } from '../services'
import { GROUP_CHAT_ID } from '../utils/constant'

export const logToGroup = function () {
  return function (req: Request, _res: Response, next: NextFunction) {
    // Send message log to FrasNymBotLog Group
    axiosService.telegram.sendMessage(
      envVars.telegramBot.logger,
      GROUP_CHAT_ID.FrasNymBotLog,
      JSON.stringify(req.body)
    )
    next()
  }
}
