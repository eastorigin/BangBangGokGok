// 유저 관련 라우터
const express = require("express");
const controller = require("../controller/Cuser");
const router = express.Router();

// GET /users/signin
router.get("/signin", controller.getSignin);

// POST /users/signin
router.post("/signin", controller.postSignin);

// POST /users/accesstoken
router.post("/accesstoken", controller.postAccessToken);

module.exports = router;
