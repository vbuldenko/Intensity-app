import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface AbonementAttributes {
  id: number;
  userId: number;
  status: 'active' | 'ended' | 'inactive';
  type: string;
  amount: number;
  price: number;
  left: number;
  paused: boolean;
  activatedAt: Date;
  expiratedAt: Date;
}

interface AbonementCreationAttributes
  extends Optional<AbonementAttributes, 'id'> {}

export default function (sequelize: Sequelize) {
  class Abonement
    extends Model<AbonementAttributes, AbonementCreationAttributes>
    implements AbonementAttributes
  {
    declare id: number;
    declare userId: number;
    declare status: 'active' | 'ended' | 'inactive';
    declare type: string;
    declare amount: number;
    declare price: number;
    declare left: number;
    declare paused: boolean;
    declare activatedAt: Date;
    declare expiratedAt: Date;

    declare createdAt: Date;
    declare updatedAt: Date;

    static associate(models: any) {
      Abonement.belongsTo(models.User, { foreignKey: 'userId' });
      Abonement.belongsToMany(models.Training, {
        through: 'History',
        as: 'trainings',
        foreignKey: 'trainingId',
      });
    }
  }

  Abonement.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      left: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      paused: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      activatedAt: DataTypes.DATE,
      expiratedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Abonement',
    },
  );

  return Abonement;
}
