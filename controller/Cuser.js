const User = require("../models").User;
const Likes = require("../models").Likes;
const jwt = require("jsonwebtoken");
exports.example = (req, res) => {
    res.render("user/profile");
};

exports.getSignin = (req, res) => {
    res.render("user/signin");
};

exports.postSignin = async (req, res) => {
    try {
        const { id, pw } = req.body;

        const userInfoInstance = await User.findOne({
            where: { id: id },
        });

        // userInfoInstance에서 dataValues 속성을 추출하여 순수한 JavaScript 객체로 변환
        const userInfo = userInfoInstance ? userInfoInstance.dataValues : null;

        console.log("로그인 창에서 입력한 id와 일치하는 DB 정보: ", userInfo);

        if (id === userInfo.id && pw === userInfo.pw) {
            // access token 발급
            const accessToken = jwt.sign(
                {
                    u_seq: userInfo.u_seq,
                    id: userInfo.id,
                    email: userInfo.email,
                    name: userInfo.name,
                    nickname: userInfo.nickname,
                },
                process.env.ACCESS_SECRET,
                {
                    expiresIn: "15m",
                    issuer: "BBGG",
                }
            );
            // refresh token 발급
            const refreshToken = jwt.sign(
                {
                    u_seq: userInfo.u_seq,
                    id: userInfo.id,
                    email: userInfo.email,
                    name: userInfo.name,
                    nickname: userInfo.nickname,
                },
                process.env.REFRESH_SECRET,
                {
                    expiresIn: "24h",
                    issuer: "BBGG",
                }
            );
            res.send({ result: true, accessToken: accessToken, refreshToken: refreshToken });
        } else {
            res.send({ result: false, message: "로그인 정보가 올바르지 않습니다." });
        }
    } catch (error) {
        res.status(500).send("server error");
    }
};

exports.postAccessToken = async (req, res) => {
    try {
        console.log(req.headers.authorization);
        if (req.headers.authorization) {
            const accessToken = req.headers.authorization.split(" ")[1];

            try {
                console.log("accessToken : ", accessToken);

                const auth = jwt.verify(accessToken, process.env.ACCESS_SECRET);
                console.log("auth : ", auth);

                const userInfoInstance = await User.findOne({
                    where: { id: auth.id },
                });

                // userInfoInstance에서 dataValues 속성을 추출하여 순수한 JavaScript 객체로 변환
                const userInfo = userInfoInstance ? userInfoInstance.dataValues : null;

                if (userInfo.id === auth.id) {
                    res.send({
                        result: true,
                        name: userInfo.name,
                        id: userInfo.id,
                        nickname: userInfo.nickname,
                    });
                }
                res.end();
            } catch (error) {
                console.log("토큰 인증 에러 ::", error);
                res.send({ result: false, message: "인증된 회원이 아닙니다." });
            }
        } else {
            res.redirect("/users/signin");
        }
    } catch (error) {
        console.log("POST /accesstoken", error);
        res.status(500).send("server error");
    }
};

// 유효성 검증
const { validationResult } = require("express-validator");
const { Post } = require("../models");

// 회원가입 요청시, 회원가입 페이지로 이동
exports.getSignup = (req, res) => {
    res.render("user/signup");
};

// 회원가입 중복 체크
exports.checkDuplicate = async (req, res) => {
    try {
        const { field, value } = req.body;

        console.log("회원가입 중복 체크", field, value);

        // 해당 옵션(아이디, 이메일, 닉네임)의 값과 동일한 값을 가지는 유저가 있는지 확인
        const userInfoInstance = await User.findOne({
            where: { [field]: value },
        });

        if (userInfoInstance) {
            // 있을 경우
            return res.send(false);
        }
        return res.send(true); // 없을 경우
    } catch (err) {
        res.status(500).send("server error");
    }
};

// 회원가입
exports.postSignup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.send({ errors: errors.array() });
    }

    await User.create({
        u_seq: null,
        id: req.body.userId,
        pw: req.body.userPw,
        email: req.body.email,
        name: req.body.name,
        nickname: req.body.nickname,
    }).then((result) => {
        console.log("회원가입 완료 result 확인", result);
        res.end();
    });
};

// 프로필 페이지 요청
exports.getProfile = async (req, res) => {
    try {
        const id = req.params.id;
        const userInfo = await User.findOne({
            where: { id: id },
        });
        console.log("프로필 페이지 접속 유저 확인", userInfo);
        res.render("user/profileEdit", { data: userInfo });
    } catch (error) {
        res.status(500).send("server error");
    }
};

// 프로필 정보 수정
exports.patchProfile = async (req, res) => {
    try {
        await User.update(
            {
                nickname: req.body.nickname,
                pw: req.body.pw,
            },
            {
                where: {
                    id: req.body.id,
                },
            }
        );
        res.send(true);
    } catch (error) {
        res.status(500).send("server error");
    }
};

// 마이페이지 요청
exports.getMyPage = async (req, res) => {
    try {
        const id = req.params.id;

        // 유저 정보
        const userInfo = await User.findOne({
            where: { id: id },
        });

        // 내 글 최신순 3개
        const myPosts = await Post.findAll({
            where: { u_seq: userInfo.u_seq },
            limit: 3,
            order: [["p_seq", "DESC"]],
        });

        // 관심 목록 최신순 3개
        const myLikes = await Likes.findAll({
            where: { u_seq: userInfo.u_seq },
            limit: 3,
            order: [["created_at", "DESC"]],
        });

        console.log("=======최신순 글", myPosts);
        console.log("=======관심 목록", myLikes);

        res.render("user/profile", { data: userInfo, myPosts: myPosts, myLikes: myLikes }); // 마이페이지에서의 페이지 이동이 일어날 때 id 값을 전송하며 이동하기 위함
    } catch (error) {
        res.status(500).send("server error");
    }
};

// 내가 쓴 글 페이지 요청
exports.getMyPost = async (req, res) => {
    try {
        const id = req.params.id;

        const u_seq = await User.findOne({
            where: { id: id },
        });

        const posts = await Post.findAll({
            where: { u_seq: u_seq.u_seq },
        });

        console.log("=======내가쓴 글", posts);

        res.render("user/myPost", { data: posts, userInfo: u_seq });
    } catch (error) {
        res.status(500).send("server error");
    }
};

// 관심 목록 요청
exports.getMyLike = async (req, res) => {
    try {
        const id = req.params.id;

        const u_seq = await User.findOne({
            where: { id: id },
        });

        const likes = await Likes.findAll({
            where: { u_seq: u_seq.u_seq },
            order: [["created_at", "DESC"]], // 최신순 정렬하여 반환
        });

        res.render("user/myLike", { data: likes });
    } catch (error) {
        res.status(500).send("server error");
    }
};
