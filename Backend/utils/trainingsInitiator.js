const Training = require("../models/training");
const predefinedSchedule = require("../utils/predefined_schedule");

// Function to calculate dates for the current week or month
function getCurrentDates(mode) {
    const currentDate = new Date();
    if (mode === "week") {
        // Calculate dates for the current week
        const currentDay = currentDate.getDay();
        const startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - currentDay + 1);
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            dates.push(new Date(date));
        }
        return dates;
    } else if (mode === "month") {
        console.log("currentDate", currentDate);
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth(); //Zero based 0 jan 11 dec
        const dates = [];

        // Iterate through all days of the current month
        for (let day = 1; day <= 31; day++) {
            const date = new Date(currentYear, currentMonth, day);
            if (date.getMonth() === currentMonth) {
                // Add dates to the array only if they belong to the current month
                dates.push(date);
            }
        }
        console.log(dates[0].getDay());
        return dates;
    } else {
        throw new Error("Invalid mode. Use 'week' or 'month'.");
    }
}

async function initializeTrainingSessions(mode) {
    try {
        const dates = getCurrentDates(mode); // Get dates for the selected mode.

        const validDays = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];

        const sessionPromises = [];

        predefinedSchedule.forEach((session) => {
            if (validDays.includes(session.day)) {
                const { day, time } = session;
                const hours = Number(time.slice(0, 2));
                const index = validDays.indexOf(day);

                // Create a Training document for each occurrence of the weekday in the current month.
                dates.forEach((date) => {
                    if (date.getDay() === index) {
                        const sessionWithDate = new Training({
                            date: new Date(date).setHours(hours, 0, 0, 0),
                            ...session,
                        });
                        sessionPromises.push(sessionWithDate.save());
                    }
                });
            }
        });

        await Promise.all(sessionPromises);

        console.log(
            `Training sessions with appropriate dates have been inserted into the database for the current ${mode}.`
        );
    } catch (error) {
        console.error("Error inserting data:", error);
    }
}

module.exports = initializeTrainingSessions;
