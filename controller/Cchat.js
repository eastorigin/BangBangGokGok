// 채팅 관련 컨트롤러
const Chat = require("../models").Chat;
const User = require("../models").User;

// 채팅 목록 페이지
exports.getChats = async (req, res) => {
    try {
        const chatLists = await Chat.findAll({
            include: {
                model: User,
                where: { id: req.params.id },
            },
            order: [["c_seq", "DESC"]],
        });
        res.render("chat/chatList", { chatLists: chatLists });
    } catch (error) {
        res.status(500).send("server error");
    }
};
