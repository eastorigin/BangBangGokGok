// 유저 관련 컨트롤러
const models = require("../models/index");

// 유효성 검증
const { validationResult } = require("express-validator");

// 회원가입 요청시, 회원가입 페이지로 이동
exports.getSignup = (req, res) => {
    res.render("user/signup");
};

// 회원가입
exports.postSignup = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    models.User.create({
        u_seq: null,
        u_id: req.body.userId,
        u_pw: req.body.userPw,
        u_nick: req.body.userNick,
        u_name: req.body.userName,
        u_email: req.body.userEmail,
    }).then((result) => {
        console.log("회원가입 완료 result 확인", result);
        res.end();
    });
};
