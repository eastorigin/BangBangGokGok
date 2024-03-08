const express = require("express");
const controller = require("../controller/Clikes");
const router = express.Router();

router.post("/", controller.postLikes);
router.delete("/", controller.deleteLikes);

module.exports = router;
