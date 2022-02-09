/* eslint-disable no-unused-vars */
import { BuildOptions, Model } from 'sequelize'

/**
 * Define how fanuser model should looks like
 */
export interface FanuserAttributes {
  id: number
  name: string
  telegram_id?: string
}
export interface FanuserModel
  extends Model<FanuserAttributes>,
  FanuserAttributes { }
export class Fanuser extends Model<FanuserModel, FanuserAttributes> { }
export type FanuserStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): FanuserModel
}

/**
 * Define how ZakatSubuh model should looks like
 */
export interface ZakatSubuhAttributes {
  fanuser_id: number
  total: number
  random_seed?: string
}
export interface ZakatSubuhModel
  extends Model<ZakatSubuhAttributes>,
  ZakatSubuhAttributes { }
export class ZakatSubuh extends Model<ZakatSubuhModel, ZakatSubuhAttributes> { }
export type ZakatSubuhStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): ZakatSubuhModel
}
