const express = require("express");
const app = express();
const controller = require("../controller/Cchat");
const router = express.Router();

router.get("/lists/:id", controller.getChats);

router.get("/rooms/:c_seq", controller.getChatRoom);

router.post("/rooms", controller.createChatRoom);

module.exports = router;
