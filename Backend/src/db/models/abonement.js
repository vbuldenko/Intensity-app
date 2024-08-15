"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Abonement extends Model {
    static associate(models) {
      // Define the association with the User model
      Abonement.belongsTo(models.User, { foreignKey: "userId" });
    }
  }

  Abonement.init(
    {
      status: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      purchase_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      activation_date: {
        type: DataTypes.DATE,
      },
      expiration_date: {
        type: DataTypes.DATE,
      },
      paused: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      left: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Abonement",
    }
  );

  return Abonement;
};
