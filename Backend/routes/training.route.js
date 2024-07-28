const express = require("express");
const trainingController = require("../controllers/training.controller");
const userExtractor = require("../utils/middleware").userExtractor;

const router = express.Router();

router.get("/", trainingController.getAll);
router.put("/:id", userExtractor, trainingController.update);
router.post("/", userExtractor, trainingController.create);
router.post("/:mode", userExtractor, trainingController.initialize);
router.delete("/", userExtractor, trainingController.removeMany);
router.delete("/:id", userExtractor, trainingController.remove);

module.exports = router;
