// 게시글 관련 라우터
const express = require("express");
const controller = require("../controller/Cpost");
const router = express.Router();

// GET /posts/list
router.get("/list", controller.getPostsList);

// GET /posts/:category
router.get("/:category", controller.getPostsByCategory);

// GET /posts/:keyword (검색엔진을 통해 개선 예정)
router.get("/search/:keyword", controller.getPostsByKeyword);

// GET /posts
router.get("/", controller.getPosts);

// POST /posts
router.post("/", controller.postPosts);

// GET /posts/detail/:p_seq
router.get("/detail/:p_seq", controller.getPostsDetail);

// PATCH /posts/detail/:p_seq
router.patch("/detail/:p_seq", controller.patchPostsDetail);

// DELETE /posts/detail/:p_seq
router.delete("/detail/:p_seq", controller.deletePostsDetail);

module.exports = router;
