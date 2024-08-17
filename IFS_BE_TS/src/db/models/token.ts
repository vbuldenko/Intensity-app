import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface TokenAttributes {
  id: number;
  refreshToken: string;
}

interface TokenCreationAttributes extends Optional<TokenAttributes, 'id'> {}

export default function (sequelize: Sequelize) {
  class Token
    extends Model<TokenAttributes, TokenCreationAttributes>
    implements TokenAttributes
  {
    public id!: number;
    public refreshToken!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    static associate(models: any) {
      // Define the association with the Abonement model
      Token.hasOne(models.User, { foreignKey: 'tokenId' });
    }
  }

  Token.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
