// 유저 관련 라우터
router.get("/signin", controller.getSignin);

router.get("/signup", controller.getSignup);

router.post("/signin", controller.postSignin);

router.post("/signup", controller.postSignup);

module.exports = router;
