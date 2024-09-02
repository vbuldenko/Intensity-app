import { QueryInterface, DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.changeColumn('Abonements', 'expiratedAt', {
      type: Sequelize.DATE,
    });
  },

  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.changeColumn('Abonements', 'expiratedAt', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },
};
