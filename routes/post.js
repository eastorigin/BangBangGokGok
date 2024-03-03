// 게시글 관련 라우터
const express = require("express");
const controller = require("../controller/Cpost");
const router = express.Router();

// GET /posts
router.get("/", controller.getPosts);

// GET /posts/:category
router.get("/:category", controller.getPostsByCategory);

// GET /posts/:keyword (검색엔진을 통해 개선 예정)
router.get("/search/:keyword", controller.getPostsByKeyword);

module.exports = router;
