import * as sequelize from 'sequelize'
import { FanuserFactory } from '../models'
import envVars from './envVars'

const dbConfig = new sequelize.Sequelize(
  envVars.postgres.url,
  envVars.postgres.options
)

export { dbConfig }

export const Fanuser = FanuserFactory(dbConfig)
