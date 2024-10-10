import { QueryInterface, DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
    // Drop the existing History table if it exists
    // await queryInterface.dropTable('History');

    await queryInterface.createTable('History', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      abonementId: {
        type: Sequelize.INTEGER,
        // allowNull: true,
        references: {
          model: 'Abonements',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      trainingId: {
        type: Sequelize.INTEGER,
        // allowNull: true,
        references: {
          model: 'Trainings',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      userId: {
        type: Sequelize.INTEGER,
        // allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
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

    // Add composite unique index
    await queryInterface.addIndex(
      'History',
      ['abonementId', 'trainingId', 'userId'],
      {
        unique: true,
        name: 'unique_reservation',
      },
    );
  },

  down: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
    // Remove the composite unique index
    await queryInterface.removeIndex('History', 'unique_reservation');

    // Drop the History table
    await queryInterface.dropTable('History');
  },
};
