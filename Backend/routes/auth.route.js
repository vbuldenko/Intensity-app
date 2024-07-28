const express = require("express");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.post("/", authController.login);
router.post("/register", authController.register);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
