const express = require("express");
const salesController = require("../controllers/sales.controller");

const router = express.Router();

router.get("/", salesController.get);
// router.post("/", salesController.create);
// router.put("/", salesController.update);
// router.delete("/", salesController.remove);

module.exports = router;
