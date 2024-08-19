import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface TrainingAttributes {
  id: number;
  type: string;
  instructorId: string;
  capacity: string;
  clients: string;
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
    public id!: number;
    public type!: string;
    public instructorId!: string;
    public capacity!: string;
    public clients!: string;
    public date!: Date;
    public day!: string;
    public time!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static associate(models: any) {
      // Define the association with the User model
      Training.hasOne(models.User, {
        foreignKey: 'instructorId',
      });
      Training.belongsToMany(models.Abonement, {
        through: 'History',
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
      clients: {
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
