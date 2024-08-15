"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Abonements",
      [
        {
          status: "active",
          type: "monthly",
          amount: 1,
          price: 29.99,
          purchase_date: new Date(),
          activation_date: new Date(),
          expiration_date: new Date(
            new Date().setMonth(new Date().getMonth() + 1)
          ),
          paused: false,
          left: 10,
          userId: 1, // Assuming there is a user with ID 1
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          status: "inactive",
          type: "annual",
          amount: 1,
          price: 299.99,
          purchase_date: new Date(),
          activation_date: new Date(),
          expiration_date: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          ),
          paused: false,
          left: 10,
          userId: 2, // Assuming there is a user with ID 2
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Abonements", null, {});
  },
};
