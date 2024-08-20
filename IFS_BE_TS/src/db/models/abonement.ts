import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface AbonementAttributes {
  id: number;
  userId: number;
  status: string;
  type: string;
  amount: number;
  price: number;
  left: number;
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
    declare status: string;
    declare type: string;
    declare amount: number;
    declare price: number;
    declare left: number;
    declare activatedAt: Date;
    declare expiratedAt: Date;

    declare createdAt: Date;
    declare updatedAt: Date;

    static associate(models: any) {
      // Define the association with the User model
      Abonement.belongsTo(models.User);
      Abonement.belongsToMany(models.Training, {
        through: 'History',
        as: 'trainings',
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
      activatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      expiratedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'Abonement',
    },
  );

  return Abonement;
}
