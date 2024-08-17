import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export default function (sequelize: Sequelize) {
  class User
    extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes
  {
    public id!: number;
    public firstName!: string;
    public lastName!: string;
    public email!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    static associate(models: any) {
      // Define the association with the Abonement model
      User.hasMany(models.Abonement, { foreignKey: 'userId' });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
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
    },
    {
      sequelize,
      modelName: 'User',
    },
  );

  return User;
}
