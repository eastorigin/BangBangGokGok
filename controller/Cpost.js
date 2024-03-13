// 게시글 관련 컨트롤러
const Post = require("../models").Post;
const User = require("../models").User;
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const { Sequelize } = require("../models");

//Redis 설정
// const redis = require("redis");
// const redisClient = redis.createClient({
//     url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
//     legacyMode: true, // 반드시 설정 !!
// });
// redisClient.on("connect", () => {
//     console.info("Redis connected!");
// });
// redisClient.on("error", (err) => {
//     console.error("Redis Client Error", err);
// });
// redisClient.connect().then();
// const redisCli = redisClient.v4;

// 캐시 체크를 위한 미들웨어
// exports.checkCache = async (req, res, next) => {
//     try {
//         const value = await redisCli.get("postList"); // Redis에서 postList 키를 이용하여 데이터를 가져옴
//         if (value) {
//             // Redis에 저장된 데이터가 존재하면 클라이언트에 바로 응답
//             const postList = JSON.parse(value);
//             return res.render("post/postList", { postList });
//         }
//         // Redis에 저장된 데이터가 없으면 다음 미들웨어 실행
//         next();
//     } catch (error) {
//         next(error);
//     }
// };

// GET /posts/list 게시글 목록 (전체 지역)
exports.getPostsList = async (req, res) => {
    try {
        const postList = await Post.findAll({
            order: [["p_seq", "DESC"]],
            include: [
                {
                    model: User,
                    attributes: ["u_seq", "nickname", "id"],
                },
            ],
        });

        // 데이터를 렌더링하기 전에 Redis에 저장
        // await redisCli.set("postList", JSON.stringify(postList)); // 캐시 저장

        res.render("post/postList", { postList: postList });
    } catch (error) {
        console.log(error);
        res.status(500).send("server error");
    }
};

// GET /posts/:category 게시글 목록 (지역별)
exports.getPostsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const postListByCategory = await Post.findAll({
            where: {
                category: category,
            },
            include: [
                {
                    model: User,
                    attributes: ["u_seq", "nickname"],
                },
            ],
            order: [["p_seq", "DESC"]],
        });

        res.render("post/postList", { postList: postListByCategory });
    } catch (error) {
        res.status(500).send("server error");
    }
};

// GET /posts/list/search?keyword=검색어
exports.getPostsByKeyword = async (req, res) => {
    try {
        const startTime = new Date(); // 시작 시간 기록
        const { keyword } = req.query;
        const postsByKeyword = await Post.findAll({
            where: Sequelize.literal(
                `MATCH(title, content, category) AGAINST('${keyword}*' IN BOOLEAN MODE)`
            ),
            // 아래 주석 삭제하지 마세요. (like % 와 비교하기 위함)
            // {
            //     [Op.or]: [
            //         { title: { [Op.like]: `%${keyword}%` } },
            //         { content: { [Op.like]: `%${keyword}%` } },
            //         { category: { [Op.like]: `%${keyword}%` } },
            //     ],
            // },

            include: [
                {
                    model: User,
                    attributes: ["u_seq", "nickname"],
                },
            ],
            order: [["p_seq", "DESC"]],
        });

        const endTime = new Date(); // 종료 시간 기록
        const executionTime = endTime - startTime; // 실행 시간 계산 (밀리초 단위)
        console.log(`Execution time: ${executionTime}ms`);

        res.render("post/postList", { postList: postsByKeyword });
    } catch (error) {
        res.status(500).send("server error");
    }
};

// GET /posts/search/category?keyword=검색어
exports.getPostsByKeywordByCategory = async (req, res) => {
    try {
        const { keyword } = req.query;
        const { category } = req.params;
        const postsByKeyword = await Post.findAll({
            where: {
                category: category,
                [Op.or]: Sequelize.literal(
                    `MATCH(title, content, category) AGAINST('${keyword}*' IN BOOLEAN MODE)`
                ),
            },
            include: [
                {
                    model: User,
                    attributes: ["u_seq", "nickname"],
                },
            ],
            order: [["p_seq", "DESC"]],
        });
        res.render("post/postList", { postList: postsByKeyword });
    } catch (error) {
        res.status(500).send("server error");
    }
};

// GET /posts 게시글 작성 페이지
exports.getPosts = (req, res) => {
    res.render("post/post");
};

// POST /posts 게시글 작성
exports.postPosts = async (req, res) => {
    try {
        // 클라이언트로부터 JWT 토큰을 받아옴
        const accessToken = req.headers.authorization.split(" ")[1];

        // JWT 토큰을 검증하고 토큰에 포함된 사용자 정보를 추출
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_SECRET);
        const u_seq = decodedToken.u_seq;

        // const { title, content, category } = req.body;
        // const file = req.file ? req.file.filename : ""; // 업로드된 파일명
        const { title, content, file, category, deal_type } = req.body;

        const newPost = await Post.create({
            title,
            content,
            file, // 파일명 저장
            category,
            u_seq,
            deal_type,
        });
        res.json(newPost);
    } catch (error) {
        res.status(500).send("server error");
    }
};

// GET /posts/detail/:p_seq
exports.getPostsDetail = async (req, res) => {
    try {
        const { p_seq } = req.params;
        const postDetail = await Post.findOne({
            where: {
                p_seq,
            },
            include: [
                {
                    model: User,
                    attributes: ["u_seq", "nickname", "distance"],
                },
            ],
        });
        res.render("post/postDetail", { postDetail: postDetail });
    } catch (error) {
        res.status(500).send("server error");
    }
};

exports.postAccessToken = async (req, res) => {
    try {
        if (req.headers.authorization) {
            const accessToken = req.headers.authorization.split(" ")[1];

            try {
                const auth = jwt.verify(accessToken, process.env.ACCESS_SECRET);

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

// PATCH /posts/detail/:p_seq
exports.patchPostsDetail = async (req, res) => {
    try {
        const { p_seq } = req.params;
        const { is_success, title, content, file, category, deal_type } = req.body;
        const updatedPost = await Post.update(
            {
                is_success,
                title,
                content,
                file,
                category,
                deal_type,
            },
            {
                where: { p_seq: p_seq },
            }
        );
        res.json(updatedPost);
    } catch (error) {
        res.status(500).send("server error");
    }
};

// DELETE /posts/detail/:p_seq
exports.deletePostsDetail = async (req, res) => {
    try {
        const { p_seq } = req.params;
        const isDeleted = await Post.destroy({
            where: {
                p_seq,
            },
        });
        if (isDeleted) {
            res.send("삭제 성공");
        } else {
            res.send("삭제 실패");
        }
    } catch (error) {
        res.status(500).send("server error");
    }
};
