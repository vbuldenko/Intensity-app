const schedule = require("node-schedule");
const Training = require("../models/training");
const Abonement = require("../models/abonement");

function scheduleDailyJob() {
  // Set up a job to automatically check and return training if needed every day
  //*/5 * * * * - every 5min
  //0 0 * * * - every day
  // 0 8-18 * * * - every day, every hour from 8 to 20 oclock
  // 0 8-20/4 * * * - every day, every 4 hours from 8 to 20 oclock
  const dailyJob = schedule.scheduleJob("0 8-20/3 * * *", async () => {
    try {
      // Find all trainings scheduled for today
      const trainings = await Training.find({
        date: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)), // Today's start time
          $lt: new Date(new Date().setHours(23, 59, 59, 999)), // Today's end time
        },
      });

      for (const training of trainings) {
        await checkAndReturnTraining(training._id);
      }
    } catch (error) {
      console.error("Error scheduling daily checks:", error.message);
    }
  });
}

async function checkAndReturnTraining(trainingId) {
  try {
    const training = await Training.findById(trainingId);

    // if (training) {
    if (training && !training.processed) {
      const currentDate = new Date();
      const timeDifference = new Date(training.date) - currentDate;

      // Check 3 hours before the scheduled time
      if (timeDifference <= 3 * 60 * 60 * 1000 && timeDifference > 0) {
        //   if (timeDifference <= 3 * 60 * 60 * 1000) {
        const attendees = training.registeredClients.length;
        // console.log("attendes - ", attendees);

        if (attendees === 1) {
          // return training to the client's abonement
          const clientId = training.registeredClients[0];
          await returnTrainingToAbonement(clientId, trainingId);
        }
      }
      // To ensure the avoidance of repetition upon restart of the app
      training.processed = true; // Should modify Schema to include this parameter
      await training.save();
    }
  } catch (error) {
    console.error("Error checking and returning training:", error.message);
  }
}

async function returnTrainingToAbonement(clientId, trainingId) {
  const abonements = await Abonement.find({ user: clientId });
  const activeAbonement = abonements.find(
    (abonement) => new Date(abonement.expiration_date) >= new Date()
  );

  //   console.log(
  //     `active abonement of user --- ${clientId} --- before`,
  //     activeAbonement
  //   );
  // console.log(`a training - ${trainingId} was returned to active abonement - ${activeAbonement.id} of user -${clientId}.`);
  activeAbonement.left += 1; //return 1 training to active abonement
  activeAbonement.history = activeAbonement.history.filter(
    (id) => id.toString() !== trainingId.toString()
  );
  const savedAbonement = await activeAbonement.save();
  //   console.log("abonement after ---", savedAbonement);
  //   console.log("*********************************************");
}

module.exports = { scheduleDailyJob };
