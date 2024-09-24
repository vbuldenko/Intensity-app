import { QueryInterface, DataTypes } from 'sequelize';
import { schedule } from '../../data/predefined_schedule';
// import { ScheduleAttributes } from '../models/schedule'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
    const trainings = [];

    // Map through the schedule object to create the seed data
    for (const day in schedule) {
      schedule[day].forEach(training => {
        trainings.push({
          time: training.time,
          type: training.type,
          maxCapacity: training.maxCapacity,
          instructorId: training.instructorId, // Assuming instructorId is null or you can provide actual IDs
          day,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    }

    // Bulk insert the trainings into the database
    await queryInterface.bulkInsert('Schedule', trainings, {});
  },

  down: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
    await queryInterface.bulkDelete('Schedule', {}, {});
  },
};
