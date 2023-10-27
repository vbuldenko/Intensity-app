const cron = require("node-cron");
const TrainingSession = require("../models/training");
const HistoricalTrainingSession = require("../models/historical_training");

//A function to initialize and schedule the data transfer
const initDataTransfer = () => {
    //runs the script at midnight on Sundays, transferring data once a week.
    cron.schedule("0 0 * * 0", async () => {
        try {
            // Get training sessions that have ended
            const currentDate = new Date();
            const endedSessions = await TrainingSession.find({
                date: { $lt: currentDate },
            });

            // Move the data to the historical collection
            for (const session of endedSessions) {
                const historicalSession = new HistoricalTrainingSession(
                    session.toObject()
                );
                await historicalSession.save();

                // Remove the session from the current collection
                await TrainingSession.findByIdAndDelete(session._id);
            }

            console.log("Data transfer completed.");
        } catch (err) {
            console.error("Error during data transfer:", err);
        }
    });
};

module.exports = {
    initDataTransfer,
};
