export class TelegramError extends Error {
  constructor(public message: string = 'TelegramError') {
    super(message)
    Object.setPrototypeOf(this, TelegramError.prototype)
  }
}

export class UnhandledMessageResponse extends Error {
  constructor(
    public botToken: string,
    public telegramId: string,
    public message: string = 'Unable to handle message'
  ) {
    super(message)
    Object.setPrototypeOf(this, UnhandledMessageResponse.prototype)
  }
}
