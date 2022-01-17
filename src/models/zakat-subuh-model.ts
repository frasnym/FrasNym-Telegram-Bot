import { DataTypes, Sequelize } from 'sequelize'
import { ZakatSubuhStatic } from '../types/model'

export function ZakatSubuhFactory(sequelize: Sequelize): ZakatSubuhStatic {
  const ZakatSubuh = <ZakatSubuhStatic>sequelize.define(
    'zakat_subuh',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      fanuserId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      total: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    },
    {
      freezeTableName: true,
      timestamps: true
    }
  )

  return ZakatSubuh
}
