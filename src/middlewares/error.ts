import { ErrorRequestHandler } from 'express'
import envVars from '../config/envVars'
import { logger } from '../config/logger'
import { ErrorResponse, FailResponse } from '../utils/jsend'

interface JsendError {
  statusCode: number
  status: string
  message?: string
  data?: any
  code?: string
  stack?: any
}

const errorConverter: ErrorRequestHandler = function (err, _req, res, next) {
  let error = err

  if (!(error instanceof FailResponse) && !(error instanceof ErrorResponse)) {
    let stack: string | undefined

    logger.error(error)
    error = new ErrorResponse(
      500,
      error.message || 'Internal Server Error',
      stack,
      'ECV'
    )
  }
  next(error)
}

const errorHandler: ErrorRequestHandler = function (
  err: JsendError,
  _req,
  res,
  _next
) {
  const { statusCode, status } = err

  res.locals.errorMessage = err.message

  const response = {
    status,
    message: err.message,
    ...(err.data && { data: err.data }),
    ...(err.code && { code: err.code }),
    ...(envVars.env === 'development' && { stack: err.stack })
  }

  if (envVars.env === 'development') {
    logger.error(JSON.stringify(response))
  }

  return res.status(statusCode).send(response)
}

export { errorHandler, errorConverter }
