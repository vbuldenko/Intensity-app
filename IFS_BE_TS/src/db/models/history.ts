import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Sequelize,
} from 'sequelize';

export default function (sequelize: Sequelize) {
  class History extends Model<
    InferAttributes<History>,
    InferCreationAttributes<History>
  > {
    declare id: CreationOptional<number>;
    declare abonementId: number;
    declare trainingId: number;
    declare userId: number;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    static associate(models: any) {
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
          model: 'Trainings',
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
