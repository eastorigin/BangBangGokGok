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

// POST /chats/rooms (채팅방 생성 구현중)
router.post("/rooms/:p_seq", controller.createChatRoom);

module.exports = router;
