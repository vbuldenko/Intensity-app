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
