const express = require("express");
const abonementController = require("../controllers/abonement.controller");
const userExtractor = require("../utils/middleware").userExtractor;

const router = express.Router();

router.get("/", abonementController.getAllAbonements);
router.get("/:id", abonementController.getAbonementById);
router.post("/", userExtractor, abonementController.createAbonement);
router.put("/:id", userExtractor, abonementController.updateAbonement);
router.delete("/:id", userExtractor, abonementController.removeAbonement);

module.exports = router;
