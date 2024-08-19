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
      // userId will be added to Tokens table
      Token.belongsTo(models.User);
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
