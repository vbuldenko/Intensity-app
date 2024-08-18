import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface AbonementAttributes {
  id: number;
  userId: number;
  status: string;
  type: string;
  amount: number;
  price: number;
  left: number;
  activatedAt: Date;
  expiratedAt: Date;
}

interface AbonementCreationAttributes
  extends Optional<AbonementAttributes, 'id'> {}

export default function (sequelize: Sequelize) {
  class Abonement
    extends Model<AbonementAttributes, AbonementCreationAttributes>
    implements AbonementAttributes
  {
    public id!: number;
    public userId!: number;
    public status!: string;
    public type!: string;
    public amount!: number;
    public price!: number;
    public left!: number;
    public activatedAt!: Date;
    public expiratedAt!: Date;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static associate(models: any) {
      // Define the association with the User model
      Abonement.belongsTo(models.User, { foreignKey: 'userId' });
      Abonement.belongsToMany(models.Training, {
        through: 'AbonementTrainings',
        as: 'trainings',
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
      activatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      expiratedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'Abonement',
    },
  );

  return Abonement;
}
