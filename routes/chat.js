// 채팅 관련 라우터
const express = require("express");
const app = express();
const controller = require("../controller/Cchat");
const { Chat, Message } = require("../models"); // 모델 객체
const router = express.Router();

// GET /chats/lists
router.get("/lists/:id", controller.getChats);

// GET /chats/rooms
router.get("/rooms/:c_seq", controller.getChatRoom);

router.post("/rooms", controller.createChatRoom2);

module.exports = router;
