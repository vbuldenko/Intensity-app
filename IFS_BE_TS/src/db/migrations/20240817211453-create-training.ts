import { QueryInterface, DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
    await queryInterface.createTable('Trainings', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      time: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      day: {
        type: Sequelize.ENUM(
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ),
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM(
          'Stretching',
          'Healthy Back',
          'ABS',
          'Fly Stretching',
          'Tabata',
          'Fly Yoga',
          'Yoga',
          'Functional',
          'Pilates',
          'Heels Basic',
          'Heels Pro',
          'Gymnastics',
        ),
        allowNull: false,
      },
      maxCapacity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      instructorId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'Users', // This should match the table name created in the User migration
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
    await queryInterface.dropTable('Trainings');
  },
};
