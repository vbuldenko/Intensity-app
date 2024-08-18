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
    public id!: number;
    public userId!: number;
    public refreshToken!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    static associate(models: any) {
      // Define the association with the Abonement model
      Token.belongsTo(models.User, { foreignKey: 'tokenId' });
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
        onDelete: 'SET NULL',
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
