const Chat = require("../models").Chat;
const User = require("../models").User;
const Message = require("../models").Message;
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

exports.getChats = async (req, res) => {
    try {
        const user = await User.findOne({
            attributes: ["u_seq", "nickname", "id"],
            where: { id: req.params.id },
        });
        const chatLists = await Chat.findAll({
            where: {
                [Op.or]: [{ u_seq: user.u_seq }, { b_seq: user.u_seq }],
            },
            order: [["c_seq", "DESC"]],
        });

        res.render("chat/chatList", {
            chatLists: chatLists,
            user: user,
            id: req.params.id,
        });
    } catch (error) {
        res.status(500).send("server error");
    }
};

exports.getChatRoom = async (req, res) => {
    try {
        const user = await User.findOne({
            attributes: ["u_seq", "nickname", "id"],
            where: { id: req.query.id },
        });

        const chatLists = await Chat.findAll({
            where: {
                [Op.or]: [{ u_seq: user.u_seq }, { b_seq: user.u_seq }],
            },
            order: [["c_seq", "DESC"]],
        });

        const messages = await Message.findAll({
            where: { c_seq: req.params.c_seq },
        });

        const chatInfo = await Chat.findOne({
            attributes: ["u_seq", "b_seq"],
            where: { c_seq: req.params.c_seq },
        });

        if (chatInfo.u_seq == user.u_seq) {
            const counter = await User.findOne({
                where: { u_seq: chatInfo.b_seq },
            });
            const c_title = [user.nickname, counter.nickname];
            res.render("chat/chat", {
                chatLists: chatLists,
                c_seq: req.params.c_seq,
                c_title: c_title,
                messages: messages,
                user: user,
                distance: counter.distance,
            });
        } else {
            const counter = await User.findOne({
                where: { u_seq: chatInfo.u_seq },
            });
            const c_title = [user.nickname, counter.nickname];
            res.render("chat/chat", {
                chatLists: chatLists,
                c_seq: req.params.c_seq,
                c_title: c_title,
                messages: messages,
                user: user,
                distance: counter.distance,
            });
        }
    } catch (err) {
        res.status(500).send("server error");
    }
};

exports.createChatRoom = async (req, res) => {
    try {
        if (req.headers.authorization) {
            const accessToken = req.headers.authorization.split(" ")[1];
            try {
                const auth = jwt.verify(accessToken, process.env.ACCESS_SECRET);
                if (auth) {
                    const { b_seq, u_seq, b_nick, u_nick, id, p_seq } = req.body;

                    const check = await Chat.findOne({
                        where: {
                            [Op.or]: [
                                { u_seq: u_seq, b_seq: b_seq },
                                { u_seq: b_seq, b_seq: u_seq },
                            ],
                        },
                    });
                    if (check) {
                        return res.send({ c_seq: check.c_seq, u_seq: check.u_seq, id: auth.id });
                    } else {
                        await Chat.create({
                            c_seq: null,
                            p_seq: p_seq,
                            u_seq: u_seq,
                            b_seq: b_seq,
                            c_title1: u_nick,
                            c_title2: b_nick,
                            unreadcnt: 0,
                            last_user: u_seq,
                        }).then(async (result) => {
                            return res.send({
                                c_seq: result.c_seq,
                                u_seq: result.u_seq,
                                id: auth.id,
                            });
                        });
                    }
                }
            } catch (error) {
                res.send({ result: false, message: "인증된 회원이 아닙니다." });
            }
        } else {
            res.redirect("/users/signin");
        }
    } catch (err) {
        res.status(500).send("server error");
    }
};
