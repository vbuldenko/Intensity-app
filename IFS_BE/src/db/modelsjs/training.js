import { DataTypes, Model } from 'sequelize';

export default function (sequelize) {
  class Training extends Model {
    static associate(models) {
      Training.belongsTo(models.User, {
        foreignKey: 'instructorId',
        as: 'instructor',
      });
      Training.belongsToMany(models.User, {
        through: models.History,
        foreignKey: 'trainingId',
        as: 'visitors',
      });
      Training.belongsToMany(models.Abonement, {
        through: models.History,
        foreignKey: 'trainingId',
        as: 'abonements',
      });
    }
  }

  Training.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      instructorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      day: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      time: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Training',
    },
  );

  return Training;
}
