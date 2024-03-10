const express = require("express");
const controller = require("../controller/Clikes");
const router = express.Router();

router.post("/", controller.postLikes);
router.delete("/", controller.deleteLikes);

// router 파일에 좋아요 수 조회 경로 추가

router.get("/:p_seq", controller.getLikesCount); // 게시물 ID를 URL 파라미터로 받는 경로 설정

// 좋아요 상태 조회 경로 추가
router.get("/status/:p_seq", controller.checkLikeStatus);

module.exports = router;
