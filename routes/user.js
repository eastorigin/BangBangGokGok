const express = require("express");
const controller = require("../controller/Cuser");
const router = express.Router();
const { body } = require("express-validator");

router.get("/signin", controller.getSignin);

router.post("/signin", controller.postSignin);

router.post("/accesstoken", controller.postAccessToken);

router.get("/signup", controller.getSignup);

router.post("/check-duplicate", controller.checkDuplicate);

router.post(
    "/signup",
    [
        body("userId")
            .trim()
            .exists()
            .withMessage("아이디를 입력해주세요.")
            .bail()
            .isLength({ min: 4 })
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

router.get("/profile/:id", controller.getProfile);

router.patch("/profile", controller.patchProfile);

router.get("/mypage/:id", controller.getMyPage);

router.get("/mypost/:id", controller.getMyPost);

router.get("/mylike/:id", controller.getMyLike);

module.exports = router;
