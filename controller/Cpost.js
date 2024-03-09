// 게시글 관련 컨트롤러
const Post = require("../models").Post;
const User = require("../models").User;
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");

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
        res.render("post/postList", { postList: postList });
    } catch (error) {
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
        console.log(req.query);
        const { keyword } = req.query;
        const postsByKeyword = await Post.findAll({
            where: {
                [Op.or]: [
                    { title: { [Op.like]: `%${keyword}%` } },
                    { content: { [Op.like]: `%${keyword}%` } },
                    { category: { [Op.like]: `%${keyword}%` } },
                ],
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

// GET /posts/search/category?keyword=검색어
exports.getPostsByKeywordByCategory = async (req, res) => {
    try {
        console.log(req.query);
        const { keyword } = req.query;
        const { category } = req.params;
        const postsByKeyword = await Post.findAll({
            where: {
                category: category,
                [Op.or]: [
                    { title: { [Op.like]: `%${keyword}%` } },
                    { content: { [Op.like]: `%${keyword}%` } },
                    { category: { [Op.like]: `%${keyword}%` } },
                ],
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
        res.render("post/postList");
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
        console.log("accessToken: ", accessToken);

        // JWT 토큰을 검증하고 토큰에 포함된 사용자 정보를 추출
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_SECRET);
        const u_seq = decodedToken.u_seq;

        // const { title, content, category } = req.body;
        // const file = req.file ? req.file.filename : ""; // 업로드된 파일명
        const { title, content, file, category } = req.body;

        const newPost = await Post.create({
            title,
            content,
            file, // 파일명 저장
            category,
            u_seq,
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
                    attributes: ["u_seq", "nickname"],
                },
            ],
        });
        console.log(postDetail);
        // res.render("post/postDetail", {
        //     postDetail: postDetail,
        //     imgSrc: postDetail.file ? `/uploads/${postDetail.file}` : null,
        // });
        res.render("post/postDetail", { postDetail: postDetail });
    } catch (error) {
        console.log(error);
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
                        u_seq: userInfo.u_seq,
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

// PATCH /posts/detail/:p_seq
exports.patchPostsDetail = async (req, res) => {
    try {
        const { p_seq } = req.params;
        const { title, content, file, category } = req.body;
        const updatedPost = await Post.update(
            {
                title,
                content,
                file,
                category,
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
        console.log(isDeleted);
        if (isDeleted) {
            res.send("삭제 성공");
        } else {
            res.send("삭제 실패");
        }
    } catch (error) {
        res.status(500).send("server error");
    }
};
