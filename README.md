# FrasNym Telegram Bot in NodeJS

An API to handle FrasNym Telegram Bot interaction. Developed using NodeJS, TypeScrypt, Express.

## 🎨 Features

1. [Morning Alms Bot](http://t.me/ZakatSubuhFrasNymBot).
A bot to help recording alms value. Now we can record the amount of alms without having to have a "piggy bank".
Available Command:
```
/hello - Greeting to show you account info
/info - Information on the amount of your alms
/randomalms - Add alms with random value
/setrandomalms - Change random alms value
```

## ❓ How to Run

1. Install [ngrok](https://ngrok.com/) so we can expose our local service to public and can be accessed everywhere.
1. In Your **ngrok** directory, connect your account with command: `./ngrok authtoken [TOKEN]`
1. Then run `./ngrok http 80` to start it up.
1. Add your **https ngrok-url** to your `.env` file as a value of `BASE_PATH`.
1. Now install [vercel-cli](https://vercel.com/cli) to deploy our site.
1. If you already setup your project in vercel, you just have to run `vercel` from your local project directory. If not, just read the [docs](https://vercel.com/docs/cli) 😜.

## 🛠 Tools

- **Telegram API Tool**: [Telegraf](https://github.com/telegraf/telegraf) is a tool to make telegram API bot so much easier. Shout out to the developer 🙌
- **Linting and Code Formatter**: with [ESLint](https://eslint.org/docs/user-guide/getting-started) and [Prettier](https://prettier.io/)
- **Git Hooks**: with [Husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged)
- **Logging**: using [Morgan](https://github.com/expressjs/morgan) integrated with [Winston](https://github.com/winstonjs/winston)
- **Environment variables**: centralized load with [dotenv](https://github.com/motdotla/dotenv) and [cross-env](https://github.com/kentcdodds/cross-env)
- **Validation**: request data validation using [Joi](https://joi.dev/api)
- **Error Handling**: centralized error handling mechanism
- **Security**: set security HTTP headers using [helmet](https://helmetjs.github.io)
- **SQL database**: [PostgreSQL](https://www.postgresql.org/) object data modeling with [Sequelize](https://sequelize.org/) ORM

## 🌲 Project Folder Structure

```
+-- src
|   +-- config
|   +-- controllers
|   +-- errors
|   +-- loaders
|   +-- middlewares
|   +-- models
|   +-- routes
|   |   +-- v1
|   +-- services
|   |   +-- fanuser-service
|   |   +-- alms-service
|   +-- types
|   |   +-- model
|   |   +-- rest-api
|   +-- utils
|   +-- validations
```

## 👮 License

[MIT](LICENSE)
