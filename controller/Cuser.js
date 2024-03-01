const User = require("../models").User;
const jwt = require("jsonwebtoken");

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
2;

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
