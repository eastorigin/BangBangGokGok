// 게시글 관련 라우터
const express = require("express");
const controller = require("../controller/Cpost");
const router = express.Router();

// GET /posts/list
router.get("/list", controller.getPostsList);

// GET /posts/:category
router.get("/:category", controller.getPostsByCategory);

// GET /posts/list/search?keyword=검색어
router.get("/list/search", controller.getPostsByKeyword);

// GET /posts/search/:category?keyword=검색어
router.get("/search/:category", controller.getPostsByKeywordByCategory);

// GET /posts
router.get("/", controller.getPosts);

// POST /posts
router.post("/", controller.postPosts);

// GET /posts/detail/:p_seq
router.get("/detail/:p_seq", controller.getPostsDetail);

// POST /posts/accesstoken
router.post("/accesstoken", controller.postAccessToken);

// PATCH /posts/detail/:p_seq
router.patch("/detail/:p_seq", controller.patchPostsDetail);

// DELETE /posts/detail/:p_seq
router.delete("/detail/:p_seq", controller.deletePostsDetail);

module.exports = router;
