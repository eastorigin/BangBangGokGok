// 채팅 관련 컨트롤러
const Chat = require("../models").Chat;
const User = require("../models").User;
const Message = require("../models").Message;
const { Op } = require("sequelize");

// 채팅 목록 페이지
exports.getChats = async (req, res) => {
    try {
        const u_seq = await User.findOne({
            attributes: ["u_seq"],
            where: { id: req.params.id },
        });
        const chatLists = await Chat.findAll({
            where: {
                [Op.or]: [{ u_seq: u_seq.u_seq }, { b_seq: u_seq.u_seq }],
            },
            order: [["c_seq", "DESC"]],
        });
        console.log("chatLists================", chatLists);
        res.render("chat/chatList", { chatLists: chatLists, u_seq: u_seq.u_seq });
    } catch (error) {
        res.status(500).send("server error");
    }
};

// 채팅방 상세 페이지
exports.getChatRoom = async (req, res) => {
    try {
        const u_seq = req.query.u_seq; // 현재 접속 유저

        // 채팅방 리스트 이동을 위해 파라미터로 유저 아이디를 전달을 위한 id 추출
        const id = await User.findOne({
            attributes: ["id"],
            where: { u_seq: u_seq },
        });

        // 채팅방 목록 불러오기
        const chatLists = await Chat.findAll({
            where: {
                [Op.or]: [{ u_seq: u_seq }, { b_seq: u_seq }],
            },
            order: [["c_seq", "DESC"]],
        });

        // 이전 대화 메세지 불러오기
        const messages = await Message.findAll({
            where: { c_seq: req.params.c_seq },
        });

        // 해당 채팅방 제목 불러오기
        const c_title = await Chat.findOne({
            attributes: ["c_title"],
            where: { c_seq: req.params.c_seq },
        });

        res.render("chat/chat", {
            chatLists: chatLists,
            c_seq: req.params.c_seq,
            c_title: c_title.c_title,
            messages: messages,
            u_seq: u_seq,
            id: id.id,
        });
    } catch (err) {
        res.status(500).send("server error");
    }
};

// 채팅방 생성하기(해당 포스트 작성자가 아닌 유저만 가능)
exports.createChatRoom = async (req, res) => {
    try {
        // 현재 접속자의 u_seq 필요(토큰 오류나면 url에 데이터값으로 담아서 전송할 것)
        const u_seq = req.query.u_seq; // 현재 접속 유저

        // 글 작성자
        const buyer = await Post.findOne({
            attributes: ["u_seq", "nickname"],
            where: { p_seq: req.params.p_seq },
        });
        await Chat.create({
            c_seq: null,
            p_seq: req.body.p_seq,
            u_seq: u_seq,
            b_seq: buyer.u_seq,
            c_title: buyer.nickname,
        }).then(async (result) => {
            console.log("채팅방 생성 완료");
            console.log("생성된 채팅방의 c_seq 확인", result.c_seq);

            // 채팅 생성과 동시에 채팅방 오픈하기
            // 채팅방 목록 불러오기
            const chatLists = await Chat.findAll({
                where: {
                    [Op.or]: [{ u_seq: u_seq }, { b_seq: u_seq }],
                },
                order: [["c_seq", "DESC"]],
            });
            // 해당 채팅방 오픈
            res.render("chat/chat", {
                chatLists: chatLists,
                c_seq: result.c_seq, // 현재 오픈하는 채팅방의 c_seq
                messages: messages,
                c_title: buyer.nickname,
                u_seq: u_seq,
                id: id.id,
            });
        });
    } catch (err) {
        res.status(500).send("server error");
    }
};
