import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface ScheduleAttributes {
  id: number;
  type: string;
  instructorId: string;
  maxCapacity: string;
  day: string;
  time: string;
}

interface ScheduleCreationAttributes
  extends Optional<ScheduleAttributes, 'id'> {}

export default function (sequelize: Sequelize) {
  class Schedule
    extends Model<ScheduleAttributes, ScheduleCreationAttributes>
    implements ScheduleAttributes
  {
    declare id: number;
    declare type: string;
    declare instructorId: string;
    declare maxCapacity: string;
    declare day: string;
    declare time: string;

    declare createdAt: Date;
    declare updatedAt: Date;

    static associate(models: any) {
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
          model: 'User',
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
    },
  );

  return Schedule;
}
