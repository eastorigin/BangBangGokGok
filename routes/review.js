const express = require("express");
const controller = require("../controller/Crivew");
const router = express.Router();

router.post("/", controller.postReview);
router.post("/check", controller.checkReview);

module.exports = router;
