"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Define the association with the Abonement model
      User.hasOne(models.Token);
      User.hasMany(models.Abonement, {
        as: "abonements",
      });
      User.hasMany(models.Training, {
        as: "trainings",
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
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
      phone: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      settings: {
        type: DataTypes.JSON,
        defaultValue: {
          fontSize: 16,
        },
      },
    },

    {
      sequelize,
      modelName: "User",
    }
  );

  return User;
};
