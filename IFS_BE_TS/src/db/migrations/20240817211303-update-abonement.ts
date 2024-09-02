import { QueryInterface, DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.changeColumn('Abonements', 'activatedAt', {
      type: Sequelize.DATE,
    });
  },

  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.changeColumn('Abonements', 'activatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },
};
