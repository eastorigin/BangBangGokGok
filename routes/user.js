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

// 회원가입 중복 확인
router.post("/check-duplicate", controller.checkDuplicate);

router.get("/profile", controller.example);

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
            .withMessage("아이디를 7글자 이상 입력해주세요.")
            .bail(),
        body("userPw")
            .trim()
            .exists()
            .withMessage("비밀번호를 입력해주세요.")
            .bail()
            .isLength({ min: 7 })
            .withMessage("비밀번호를 7글자 이상 입력해주세요.")
            .bail(),
        body("nickname")
            .trim()
            .exists()
            .withMessage("닉네임을 입력해주세요.")
            .bail()
            .isLength({ min: 3 })
            .withMessage("닉네임을 3글자 이상 입력해주세요.")
            .bail(),
        body("name")
            .trim()
            .exists()
            .withMessage("이름을 입력해주세요.")
            .bail()
            .isLength({ min: 2 })
            .withMessage("이름을 2글자 이상 입력해주세요.")
            .bail(),
        body("email")
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

// GET /users/profile/:id
router.get("/profile/:id", controller.getProfile);

// 프로필 수정
router.patch("/profile", controller.patchProfile);

// GET /users/mypage/:id
router.get("/mypage/:id", controller.getMyPage);

// GET /users/mypost/:id
router.get("/mypost/:id", controller.getMyPost);

// GET /users/mylike/:id
router.get("/mylike/:id", controller.getMyLike);

module.exports = router;
