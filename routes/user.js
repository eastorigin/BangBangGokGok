// 유저 관련 라우터
const express = require("express");
const controller = require("../controller/Cuser");
const router = express.Router();
// 유효성 검증
const { body } = require("express-validator");

// GET /users/signin
router.get("/signin", controller.getSignin);

// POST /users/signin
router.post("/signin", controller.postSignin);

// POST /users/accesstoken
router.post("/accesstoken", controller.postAccessToken);


// 회원가입 요청
router.get("/signup", controller.getSignup);

// 회원가입 처리
router.post(
    "/signup",
    [
        body("userId")
            .trim()
            .exists()
            .withMessage("아이디를 입력해주세요.")
            .bail()
            .isLength({ min: 7 })
            .withMessage("7글자 이상 입력해주세요.")
            .bail(),
        body("userPw")
            .trim()
            .exists()
            .withMessage("비밀번호를 입력해주세요.")
            .bail()
            .isLength({ min: 7 })
            .withMessage("7글자 이상 입력해주세요.")
            .bail(),
        body("userNick")
            .trim()
            .exists()
            .withMessage("닉네임을 입력해주세요.")
            .bail()
            .isLength({ min: 3 })
            .withMessage("3글자 이상 입력해주세요.")
            .bail(),
        body("userName")
            .trim()
            .exists()
            .withMessage("이름을 입력해주세요.")
            .bail()
            .isLength({ min: 2 })
            .withMessage("2글자 이상 입력해주세요.")
            .bail(),
        body("userEmail")
            .trim()
            .exists()
            .withMessage("이메일을 입력해주세요.")
            .bail()
            .isEmail()
            .withMessage("이메일 형식으로 입력해주세요.")
            .bail(),
    ],
    controller.postSignup
);

module.exports = router;
