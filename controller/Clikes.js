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
