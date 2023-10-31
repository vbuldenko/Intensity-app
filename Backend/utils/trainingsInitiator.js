const Training = require("../models/training");
const predefinedSchedule = require("../utils/predefined_schedule");

// Function to calculate dates for the current week based on the day parameter
function getCurrentWeekDates() {
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); //returns the day of the week (from 0 to 6) of a date
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - currentDay + 1); // Set to the first day of the week (Monday is 1)
    // startDate.setHours(0, 0, 0, 0); // Set the time to midnight

    const dates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        dates.push(date);
    }

    return dates;
}

async function initializeTrainingSessions() {
    try {
        const dates = getCurrentWeekDates();
        // Initialize training sessions of the week based on the predefined schedule
        for (const session of predefinedSchedule) {
            const { day, time } = session;
            const hours = Number(time.slice(0, 2));
            const index = [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
            ].indexOf(day);
            if (index !== -1) {
                const sessionWithDate = new Training({
                    date: dates[index].setHours(hours, 0, 0, 0),
                    ...session,
                });
                await sessionWithDate.save();
            }
        }

        console.log(
            "Training sessions with appropriate dates have been inserted into the database."
        );
    } catch (error) {
        console.error("Error inserting data:", error);
    }
}

module.exports = initializeTrainingSessions;
