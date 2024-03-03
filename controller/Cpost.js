// 게시글 관련 컨트롤러
const Post = require("../models").Post;
const { Op } = require("sequelize");

// 게시글 목록 (전체 지역)
exports.getPosts = async (req, res) => {
    try {
        const postList = await Post.findAll({
            order: [["p_seq", "DESC"]],
        });
        console.log(postList);
        res.render("post/postList", { postList: postList });
    } catch (error) {
        res.status(500).send("server error");
    }
};

// 게시글 목록 (지역별)
exports.getPostsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const postListByCategory = await Post.findAll({
            where: {
                category: category,
            },
            order: [["p_seq", "DESC"]],
        });
        res.render("post/postList", { postList: postListByCategory });
    } catch (error) {
        res.status(500).send("server error");
    }
};

// 게시글 목록 (검색 결과)
exports.getPostsByKeyword = async (req, res) => {
    try {
        const { keyword } = req.params;
        const postsByKeyword = await Post.findAll({
            where: {
                [Op.or]: [
                    { title: { [Op.like]: `%${keyword}%` } },
                    { category: { [Op.like]: `%${keyword}%` } },
                ],
            },
        });
        res.render("post/postList", { postList: postsByKeyword });
    } catch (error) {
        res.status(500).send("server error");
    }
};
