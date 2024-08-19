"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Training extends Model {
    static associate(models) {
      // Define the association with the Abonement model
      Training.belongsTo(models.User, {
        foreignKey: "instructorId",
      });
      Training.belongsToMany(models.Abonement, {
        through: "History",
        as: "abonements",
      });
    }
  }

  Training.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      instructorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      clients: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      day: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      time: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Training",
    }
  );

  return Training;
};
