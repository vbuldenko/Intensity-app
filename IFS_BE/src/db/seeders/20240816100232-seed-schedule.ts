import { QueryInterface, DataTypes } from 'sequelize';
import { schedule } from '../../data/predefined_schedule';
import { ScheduleTraining } from '../../types/ScheduleTraining';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
    const trainings: ScheduleTraining[] = [];

    // Map through the schedule object to create the seed data
    for (const day in schedule) {
      schedule[day].forEach((training: ScheduleTraining) => {
        trainings.push({
          time: training.time,
          type: training.type,
          maxCapacity: training.maxCapacity,
          instructorId: training.instructorId,
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
