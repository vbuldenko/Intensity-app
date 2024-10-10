import { DataTypes, Model } from 'sequelize';

export default function (sequelize) {
  class Schedule extends Model {
    static associate(models) {
      Schedule.belongsTo(models.User, {
        foreignKey: 'instructorId',
      });
    }
  }

  Schedule.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: DataTypes.INTEGER,
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
      maxCapacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      day: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      time: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Schedule',
      tableName: 'Schedule',
    },
  );

  return Schedule;
}
