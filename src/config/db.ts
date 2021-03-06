import * as sequelize from 'sequelize'
import { FanuserFactory, ZakatSubuhFactory } from '../models'
import envVars from './envVars'

const dbConfig = new sequelize.Sequelize(envVars.postgres.url, {
  logging: false,
  dialect: 'postgres',
  dialectModule: require('pg')
})

export { dbConfig }

export const Fanuser = FanuserFactory(dbConfig)
export const ZakatSubuh = ZakatSubuhFactory(dbConfig)

ZakatSubuh.belongsTo(Fanuser, { foreignKey: 'fanuser_id', targetKey: 'id' })
