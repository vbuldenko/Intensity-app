import { Model, DataTypes, Sequelize } from 'sequelize';

class User extends Model {
  declare id: number;
  declare firstName: string;
  declare lastName: string;
  declare email: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  static associate(models: { [key: string]: any }) {
    // A user can have many abonements
    this.hasMany(models.Abonement, {
      foreignKey: 'userId',
      as: 'abonements', // Alias for the association
    });
  }
}

export const initUserModel = (sequelize: Sequelize) => {
  User.init(
    {
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
};

export default User;

// import { DataTypes, Sequelize } from 'sequelize';

// const User = (sequelize: Sequelize) => {
//   const UserModel = sequelize.define(
//     'User',
//     {
//       firstName: DataTypes.STRING,
//       lastName: DataTypes.STRING,
//       email: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true,
//       },
//     },
//     {
//       tableName: 'Users',
//     },
//   );

//   UserModel.associate = (models: { [key: string]: any }) => {
//     // A user can have many abonements
//     UserModel.hasMany(models.Abonement, {
//       foreignKey: 'userId',
//       as: 'abonements',
//     });
//   };

//   return UserModel;
// };

// export default User;
