/* eslint-disable no-unused-vars */
import { BuildOptions, Model } from 'sequelize'

/**
 * Define how fanuser model should looks like
 */
export interface FanuserAttributes {
  id: number
  name: string
  telegramId?: string
  createdAt?: Date
  updatedAt?: Date
}
export interface FanuserModel
  extends Model<FanuserAttributes>,
    FanuserAttributes {}
export class Fanuser extends Model<FanuserModel, FanuserAttributes> {}
export type FanuserStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): FanuserModel
}
