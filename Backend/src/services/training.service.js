const Training = require("../models/training");
const initializeTrainingSessions = require("../utils/trainingsInitiator");

const getAll = async () => {
  return await Training.find({}).populate("instructor", {
    surname: 1,
    name: 1,
  });
};

const update = async (trainingId, user, updateType) => {
  const training = await Training.findById(trainingId);
  if (!training) {
    throw new Error("Training not found.");
  }

  switch (updateType) {
    case "reservation":
      if (training.registeredClients.includes(user.id)) {
        throw new Error(
          "Already reserved: You have already reserved your place!"
        );
      }
      training.registeredClients.push(user.id);
      break;
    case "cancellation":
      const index = training.registeredClients.indexOf(user.id);
      if (index === -1) {
        throw new Error("Not reserved: You have not reserved a place!");
      }
      training.registeredClients.splice(index, 1);
      break;
    default:
      throw new Error("Invalid updateType.");
  }

  await training.save();
  const populatedTraining = await Training.findById(training.id).populate(
    "instructor"
  );

  return populatedTraining;
};

const create = async (body) => {
  const newTrainingSession = new Training(body);
  return await newTrainingSession.save();
};

const remove = async (trainingId) => {
  const training = await Training.findById(trainingId);
  if (!training) {
    throw new Error("Training not found.");
  }
  await Training.findByIdAndRemove(trainingId);
};

const initialize = (mode) => {
  initializeTrainingSessions(mode);
};

const removeMany = async () => {
  await Training.deleteMany({});
};

module.exports = {
  getAll,
  update,
  create,
  remove,
  initialize,
  removeMany,
};
