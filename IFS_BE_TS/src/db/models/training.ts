import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface TrainingAttributes {
  id: number;
  type: string;
  instructorId: string;
  capacity: string;
  date: Date;
  day: string;
  time: string;
}

interface TrainingCreationAttributes
  extends Optional<TrainingAttributes, 'id'> {}

export default function (sequelize: Sequelize) {
  class Training
    extends Model<TrainingAttributes, TrainingCreationAttributes>
    implements TrainingAttributes
  {
    declare id: number;
    declare type: string;
    declare instructorId: string;
    declare capacity: string;
    declare date: Date;
    declare day: string;
    declare time: string;

    declare createdAt: Date;
    declare updatedAt: Date;

    static associate(models: any) {
      // Define the association with the User model
      Training.belongsTo(models.User, {
        foreignKey: 'instructorId',
      });
      Training.belongsToMany(models.Abonement, {
        through: 'History',
        as: 'abonements',
      });
      Training.belongsToMany(models.User, {
        through: 'History',
        as: 'visitors',
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
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      instructorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
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
      modelName: 'Training',
    },
  );

  return Training;
}
