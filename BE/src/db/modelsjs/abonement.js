import { DataTypes, Model } from 'sequelize';

export default function (sequelize) {
  class Abonement extends Model {
    static associate(models) {
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
          model: 'Users',
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
