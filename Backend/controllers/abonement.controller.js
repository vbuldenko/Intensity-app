const abonementService = require("../services/abonement.service");

async function getAllAbonements(req, res, next) {
  try {
    const abonements = await abonementService.getAllAbonements();
    res.json(abonements);
  } catch (error) {
    next(error);
  }
}

async function getAbonementById(req, res, next) {
  try {
    const abonement = await abonementService.getAbonementById(req.params.id);
    if (abonement) {
      res.json(abonement);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error);
  }
}

async function updateAbonement(req, res, next) {
  const { body, user } = req;
  const abonementId = req.params.id;

  if (!user) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  try {
    const updatedAbonement = await abonementService.updateAbonement(
      abonementId,
      body,
      user
    );
    res.json(updatedAbonement);
  } catch (error) {
    next(error);
  }
}

async function createAbonement(req, res, next) {
  const { body, user } = req;

  if (!user) {
    return res.status(401).json({ error: "Operation not permitted" });
  }

  try {
    const newAbonement = await abonementService.createAbonement(body, user);
    res.status(201).json(newAbonement);
  } catch (error) {
    next(error);
  }
}

async function removeAbonement(req, res, next) {
  const abonementId = req.params.id;
  const { user } = req;

  try {
    await abonementService.removeAbonement(abonementId, user);
    res.status(204).end();
  } catch (error) {
    if (error.message === "Abonement not found") {
      res.status(404).json({ error: error.message });
    } else if (error.message.startsWith("Unauthorized")) {
      res.status(401).json({ error: error.message });
    } else {
      next(error);
    }
  }
}

module.exports = {
  getAllAbonements,
  getAbonementById,
  updateAbonement,
  createAbonement,
  removeAbonement,
};
