const trainingService = require("../services/training.service");

const getAll = async (req, res, next) => {
  try {
    const trainingSessions = await trainingService.getAll();
    res.json(trainingSessions);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  const trainingId = req.params.id;
  const user = req.user;
  const { updateType } = req.body;

  if (!user || user.role !== "client") {
    return res.status(401).json({
      error: "Unauthorized: User not authenticated or not in client role.",
    });
  }

  try {
    const updatedTraining = await trainingService.update(
      trainingId,
      user,
      updateType
    );

    res.json(updatedTraining);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  const { body, user } = req;

  if (!user && user.role !== "admin") {
    return res.status(401).json({ error: "Operation not permitted" });
  }

  try {
    const newTrainingSession = await trainingService.create(body);
    res.status(201).json(newTrainingSession);
  } catch (error) {
    next(error);
  }
};

const initialize = async (req, res, next) => {
  const { user } = req;
  const { mode } = req.params;

  if (!user && user.role !== "admin") {
    return res.status(401).json({ error: "Operation not permitted" });
  }

  try {
    trainingService.initialize(mode);
    res.status(201).end();
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  const user = req.user;

  if (!user && user.role !== "admin") {
    return res.status(401).json({ error: "Operation not permitted" });
  }

  try {
    await trainingService.remove(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const removeMany = async (req, res, next) => {
  const user = req.user;

  if (!user && user.role !== "admin") {
    return res.status(403).json({ error: "Operation not permitted" });
  }

  try {
    await trainingService.removeMany();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  update,
  create,
  remove,
  initialize,
  removeMany,
};
