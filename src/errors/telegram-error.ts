export class TelegramError extends Error {
  constructor(public message: string = 'TelegramError') {
    super(message)
    Object.setPrototypeOf(this, TelegramError.prototype)
  }
}
