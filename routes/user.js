// 유저 관련 라우터
router.get("/signin", controller.getSignin);

router.post("/signin", controller.postSignin);

module.exports = router;
