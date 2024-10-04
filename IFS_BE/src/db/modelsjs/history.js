import { DataTypes, Model } from 'sequelize';

export default function (sequelize) {
  class History extends Model {
    static associate(models) {
      History.belongsTo(models.Abonement, { foreignKey: 'abonementId' });
      History.belongsTo(models.Training, { foreignKey: 'trainingId' });
      History.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }

  History.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      abonementId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Abonements',
          key: 'id',
        },
      },
      trainingId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Training',
          key: 'id',
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'History',
      tableName: 'History',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['abonementId', 'trainingId', 'userId'],
        },
      ],
    },
  );

  return History;
}
