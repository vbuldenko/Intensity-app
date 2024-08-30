import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface TokenAttributes {
  id: number;
  userId: number;
  refreshToken: string;
}

interface TokenCreationAttributes extends Optional<TokenAttributes, 'id'> {}

export default function (sequelize: Sequelize) {
  class Token
    extends Model<TokenAttributes, TokenCreationAttributes>
    implements TokenAttributes
  {
    declare id: number;
    declare userId: number;
    declare refreshToken: string;

    declare createdAt: Date;
    declare updatedAt: Date;

    static associate(models: any) {
      Token.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }

  Token.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // This should match the table name created in the User migration
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      refreshToken: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Token',
    },
  );

  return Token;
}
