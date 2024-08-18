import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import abonement from './abonement';

interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  settings: {};
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
    public phone!: string;
    public password!: string;
    public role!: string;
    public settings!: {};

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    static associate(models: any) {
      // Define the association with the Abonement model
      User.hasOne(models.Token, {
        foreignKey: 'tokenId',
      });
      User.hasMany(models.Abonement, {
        foreignKey: 'userId',
        as: 'abonements',
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
    },

    {
      sequelize,
      modelName: 'User',
    },
  );

  return User;
}
