const express = require("express");
const controller = require("../controller/Clikes");
const router = express.Router();

router.post("/", controller.postLikes);

router.delete("/", controller.deleteLikes);

router.get("/:p_seq", controller.getLikesCount);

router.get("/status/:p_seq", controller.checkLikeStatus);

module.exports = router;
