const Likes = require("../models").Likes;
const jwt = require("jsonwebtoken");

exports.postLikes = async (req, res) => {
    try {
        const accessToken = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_SECRET);
        const u_seq = decodedToken.u_seq;

        const newLike = await Likes.create({
            p_seq: req.body.currentPseq,
            u_seq,
        });
        res.status(200).send(newLike);
    } catch (error) {
        res.status(500).send("server error");
    }
};

exports.deleteLikes = async (req, res) => {
    try {
        const accessToken = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_SECRET);
        const u_seq = decodedToken.u_seq;

        const deletedLike = await Likes.destroy({
            where: {
                p_seq: req.body.currentPseq,
                u_seq,
            },
        });
        res.status(200).send({ deletedLike });
    } catch (error) {
        res.status(500).send("server error");
    }
};

// controller/Clikes.js에 좋아요 수 조회 컨트롤러 함수 추가
exports.getLikesCount = async (req, res) => {
    try {
        const p_seq = req.params.p_seq;
        const likesCount = await Likes.count({
            where: { p_seq: p_seq },
        });
        res.status(200).send({ p_seq: p_seq, likesCount: likesCount });
    } catch (error) {
        res.status(500).send("server error");
    }
};

// 좋아요 상태 조회 컨트롤러 함수 추가
exports.checkLikeStatus = async (req, res) => {
    try {
        const accessToken = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_SECRET);
        const u_seq = decodedToken.u_seq;
        const p_seq = req.params.p_seq;

        const like = await Likes.findOne({
            where: {
                p_seq: p_seq,
                u_seq: u_seq,
            },
        });
        res.status(200).send({ isLiked: !!like });
    } catch (error) {
        res.status(500).send("server error");
    }
};
