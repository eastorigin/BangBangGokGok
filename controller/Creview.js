const Review = require("../models").Review;
const User = require("../models").User;

exports.postReview = async (req, res) => {
    try {
        const { receiverNick, sender, score } = req.body;

        // 평가 받는 유저
        const receiver = await User.findOne({
            where: { nickname: receiverNick },
        });

        const review = await Review.create({
            r_seq: null,
            u_seq: receiver.u_seq,
            sender: sender,
            score: score,
        });
        let temp = receiver.distance;
        temp = temp + score * 0.1;

        await User.update({ distance: temp }, { where: { u_seq: receiver.u_seq } });

        res.status(200).send({ result: review, message: "평가가 완료되었습니다." });
    } catch (error) {
        res.status(500).send("server error");
    }
};

exports.checkReview = async (req, res) => {
    try {
        const { receiverNick, sender, score } = req.body;

        // 평가 받는 유저
        const receiver = await User.findOne({
            where: { nickname: receiverNick },
        });

        // 기존에 했던 평가가 있는지 확인
        const check = await Review.findOne({
            where: { u_seq: receiver.u_seq, sender: sender },
        });

        if (check) {
            res.send({ result: false, message: "이미 평가를 제출하셨습니다." });
        } else {
            res.status(200).send({ result: true });
        }
    } catch (error) {
        res.status(500).send("server error");
    }
};
