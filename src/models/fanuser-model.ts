import { DataTypes, Sequelize } from 'sequelize'
import { FanuserStatic } from '../types/model'

export function FanuserFactory(sequelize: Sequelize): FanuserStatic {
  const Fanuser = <FanuserStatic>sequelize.define(
    'fanuser',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      telegramId: {
        type: DataTypes.STRING(10),
        allowNull: true
      }
    },
    {
      freezeTableName: true,
      timestamps: true
    }
  )

  return Fanuser
}
