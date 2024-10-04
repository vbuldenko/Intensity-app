import { DataTypes, Model } from 'sequelize';

export default function (sequelize) {
  class User extends Model {
    getFullname() {
      return [this.firstName, this.lastName].join(' ');
    }

    static associate(models) {
      User.hasOne(models.Token, { foreignKey: 'userId' });
      User.hasMany(models.Abonement, {
        foreignKey: 'userId',
        as: 'abonements',
      });
      User.hasMany(models.Training, {
        foreignKey: 'instructorId',
        as: 'trainings',
      });
      User.hasMany(models.Schedule, {
        foreignKey: 'instructorId',
      });
      User.belongsToMany(models.Training, {
        through: models.History,
        foreignKey: 'userId',
        as: 'attendedTrainings',
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      activationToken: DataTypes.STRING,
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      settings: {
        type: DataTypes.JSON,
        defaultValue: {
          fontSize: 16,
        },
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'User',
    },
  );

  return User;
}