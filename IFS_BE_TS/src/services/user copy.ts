import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Define the attributes for the User model
interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  activationToken: string;
}

// Define creation attributes, omitting the `id` as it's auto-incremented
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// Define the User model class
class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public activationToken!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the model
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    activationToken: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: 'users',
  },
);

export default User;
