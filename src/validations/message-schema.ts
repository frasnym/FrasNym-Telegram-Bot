import Joi from 'joi'
import { IValidation } from '../middlewares/validate'

export const newMessageToMe: IValidation = {
  body: Joi.object({
    message: Joi.object({
      text: Joi.string().required(),
      chat: Joi.object({
        id: Joi.string().required()
      }).required()
    }).required()
  })
}
