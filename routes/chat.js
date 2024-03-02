// 채팅 관련 라우터
const express = require("express");
const controller = require("../controller/Cchat");
const router = express.Router();

// GET /chats/rooms
router.get("/rooms/:id", controller.getChats);

module.exports = router;
