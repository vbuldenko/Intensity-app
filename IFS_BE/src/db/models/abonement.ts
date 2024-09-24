import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Sequelize,
} from 'sequelize';

export default function (sequelize: Sequelize) {
  class Abonement extends Model<
    InferAttributes<Abonement>,
    InferCreationAttributes<Abonement>
  > {
    declare id: CreationOptional<number>;
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
      Abonement.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Abonement.belongsToMany(models.Training, {
        through: models.History,
        foreignKey: 'abonementId',
        as: 'visitedTrainings',
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
        references: {
          model: 'User',
          key: 'id',
        },
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
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Abonement',
    },
  );

  return Abonement;
}
