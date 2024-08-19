"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Abonement extends Model {
    static associate(models) {
      // Define the association with the User model
      Abonement.belongsTo(models.User);
      Abonement.belongsToMany(models.Training, {
        through: "History",
        as: "trainings",
      });
    }
  }

  Abonement.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      left: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      activatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      expiratedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Abonement",
    }
  );

  return Abonement;
};
