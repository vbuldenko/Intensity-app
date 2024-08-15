import { Model, DataTypes, Sequelize } from 'sequelize';

class Abonement extends Model {
  declare id: number;
  declare status: string;
  declare type: string;
  declare amount: number;
  declare price: number;
  declare purchase_date: Date;
  declare activation_date?: Date;
  declare expiration_date?: Date;
  declare paused?: boolean;
  declare left?: number;
  declare userId?: number;

  // Define the association in a separate method
  static associate(models: { [key: string]: any }) {
    this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }
}

export const initAbonementModel = (sequelize: Sequelize) => {
  Abonement.init(
    {
      status: DataTypes.STRING,
      type: DataTypes.STRING,
      amount: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      price: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      purchase_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      activation_date: DataTypes.DATE,
      expiration_date: DataTypes.DATE,
      paused: DataTypes.BOOLEAN,
      left: DataTypes.NUMBER,
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users', // Name of the User table
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Abonement',
    },
  );
};

export default Abonement;

// import { DataTypes, Sequelize } from 'sequelize';

// const Abonement = (sequelize: Sequelize) => {
//   const AbonementModel = sequelize.define(
//     'Abonement',
//     {
//       status: DataTypes.STRING,
//       type: DataTypes.STRING,
//       amount: {
//         type: DataTypes.NUMBER,
//         allowNull: false,
//       },
//       price: {
//         type: DataTypes.NUMBER,
//         allowNull: false,
//       },
//       purchase_date: {
//         type: DataTypes.DATE,
//         allowNull: false,
//       },
//       activation_date: DataTypes.DATE,
//       expiration_date: DataTypes.DATE,
//       paused: DataTypes.BOOLEAN,
//       left: DataTypes.NUMBER,
//       userId: {
//         type: DataTypes.INTEGER,
//         references: {
//           model: 'Users', // Name of the User table
//           key: 'id',
//         },
//       },
//     },
//     {
//       tableName: 'Abonements',
//     },
//   );

//   AbonementModel.associate = (models: { [key: string]: any }) => {
//     // An abonement belongs to a user
//     AbonementModel.belongsTo(models.User, {
//       foreignKey: 'userId',
//       as: 'user',
//     });
//   };

//   return AbonementModel;
// };

// export default Abonement;
