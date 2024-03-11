const User = require("../models").User;
const Likes = require("../models").Likes;
const Post = require("../models").Post;
const jwt = require("jsonwebtoken");
exports.example = (req, res) => {
    res.render("user/profile");
};

exports.getSignin = (req, res) => {
    res.render("user/signin");
};

exports.postSignin = async (req, res) => {
    try {
        // 로그인 창에서 입력받은 id, pw
        const { id, pw } = req.body;

        const userInfoInstance = await User.findOne({
            where: { id: id },
        });

        if (!userInfoInstance) {
            // 아이디가 존재하지 않는 경우
            return res.send({ result: false, message: "존재하지 않는 아이디입니다." });
        }

        // userInfoInstance에서 dataValues 속성을 추출하여 순수한 JavaScript 객체로 변환
        // userInfo란 로그인 창에서 입력받은 id와 같은 id인, DB에 있는 회원정보
        const userInfo = userInfoInstance ? userInfoInstance.dataValues : null;

        if (id === userInfo.id && pw !== userInfo.pw) {
            return res.send({ result: false, message: "비밀번호가 일치하지 않습니다." });
        }

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
                    expiresIn: "24h",
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
            res.send({
                result: true,
                accessToken: accessToken,
                refreshToken: refreshToken,
                nickname: userInfo.nickname,
            });
        } else {
            res.send({ result: false, message: "로그인 정보가 올바르지 않습니다." });
        }
    } catch (error) {
        res.status(500).send("server error");
    }
};

exports.postAccessToken = async (req, res) => {
    try {
        if (req.headers.authorization) {
            const accessToken = req.headers.authorization.split(" ")[1];

            try {
                // accessToken을 통해 검증된 회원 auth
                const auth = jwt.verify(accessToken, process.env.ACCESS_SECRET);

                const userInfoInstance = await User.findOne({
                    where: { id: auth.id },
                });

                // userInfoInstance에서 dataValues 속성을 추출하여 순수한 JavaScript 객체로 변환
                // userInfo란 accessToken을 통해 검증된 id와 같은 id인, DB에 있는 회원정보
                const userInfo = userInfoInstance ? userInfoInstance.dataValues : null;

                if (userInfo.id === auth.id) {
                    res.send({
                        result: true,
                        name: userInfo.name,
                        id: userInfo.id,
                        nickname: userInfo.nickname,
                        u_seq: userInfo.u_seq,
                    });
                }
                res.end();
            } catch (error) {
                res.send({ result: false, message: "인증된 회원이 아닙니다." });
            }
        } else {
            res.redirect("/users/signin");
        }
    } catch (error) {
        res.status(500).send("server error");
    }
};

// 유효성 검증
const { validationResult } = require("express-validator");
const { compareSync } = require("bcrypt");

// 회원가입 요청시, 회원가입 페이지로 이동
exports.getSignup = (req, res) => {
    res.render("user/signup");
};

// 회원가입 중복 체크
exports.checkDuplicate = async (req, res) => {
    try {
        const { field, value } = req.body;

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
        distance: 0,
    }).then((result) => {
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

        let result = [];

        // 관심 목록 최신순 3개
        Likes.findAll({
            where: { u_seq: userInfo.u_seq },
            include: [
                {
                    model: Post,
                },
            ],
            order: [["l_seq", "DESC"]], // 최신순 정렬
            limit: 3,
        }).then((likes) => {
            likes.forEach((like) => {
                result.push(like.Post);
            });
            res.render("user/profile", { data: userInfo, myPosts: myPosts, myLikes: result });
        });
    } catch (error) {
        res.status(500).send("server error");
    }
};

// 내가 쓴 글 페이지 요청
exports.getMyPost = async (req, res) => {
    try {
        const id = req.params.id;

        const user = await User.findOne({
            where: { id: id },
        });

        const posts = await Post.findAll({
            where: { u_seq: user.u_seq },
        });

        res.render("user/myPost", { data: posts, userInfo: user });
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

        let result = [];
        Likes.findAll({
            where: { u_seq: u_seq.u_seq },
            include: [
                {
                    model: Post,
                },
            ],
            order: [["l_seq", "DESC"]], // 최신순 정렬
        }).then((likes) => {
            likes.forEach((like) => {
                result.push(like.Post);
            });
            res.render("user/myLike", { data: result, id: id });
        });
    } catch (error) {
        res.status(500).send("server error");
    }
};
