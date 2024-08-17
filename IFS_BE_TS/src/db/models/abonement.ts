import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface AbonementAttributes {
  id: number;
  trainings: number;
  userId: number;
}

interface AbonementCreationAttributes
  extends Optional<AbonementAttributes, 'id'> {}

export default function (sequelize: Sequelize) {
  class Abonement
    extends Model<AbonementAttributes, AbonementCreationAttributes>
    implements AbonementAttributes
  {
    public id!: number;
    public trainings!: number;
    public userId!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static associate(models: any) {
      // Define the association with the User model
      Abonement.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }

  Abonement.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      trainings: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Abonement',
    },
  );

  return Abonement;
}
