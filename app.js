const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const { Op } = require("sequelize");

const app = express();
const server = http.createServer(app); // 서버 객체 생성
const io = socketIO(server);
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT;
const db = require("./models");

app.set("view engine", "ejs");
app.set("views", "./views");
app.use("/static", express.static(__dirname + "/static"));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const indexRouter = require("./routes/index");
app.use("/", indexRouter);

const userRouter = require("./routes/user");
app.use("/users", userRouter);

const chatRouter = require("./routes/chat");
app.use("/chats", chatRouter);

const postRouter = require("./routes/post");
app.use("/posts", postRouter);

// 클라이언트가 서버에 socket.io를 통해 접속한다면 발생하는 이벤트
io.on("connection", (socket) => {
    // socket: 접속한 클라이언트
    console.log("==========클라이언트 접속 확인");

    // 메세지 읽음 처리(isRead: 0 -> 1 업데이트)
    socket.on("readMessage", async ({ c_seq, u_seq }) => {
        try {
            // 본인이 전송한 메세지가 아닌 경우만 읽음 처리
            await db.Message.update(
                { isread: 1 },
                {
                    where: {
                        c_seq: c_seq,
                        u_seq: { [Op.ne]: u_seq },
                    },
                }
            );

            // 읽지 않은 메세지의 개수 가져오기(isRead: 0)
            const unreadCount = await db.Message.count({
                where: {
                    [Op.and]: [{ isread: 0 }, { c_seq: c_seq }],
                },
            });

            // 해당 채팅방의 읽지 않은 메세지 개수를 update
            await db.Chat.update({ unreadcnt: unreadCount }, { where: { c_seq: c_seq } });
        } catch (err) {
            console.log("server error");
        }
    });

    // 채팅방 접속
    socket.on("join", async ({ c_seq, u_seq }) => {
        socket.join(`chatroom-${c_seq}`); // 클라이언트로부터 수신한 채팅방 번호로 room에 참여

        // 채팅방의 마지막 접속 유저를 업데이트
        await db.Chat.update({ last_user: u_seq }, { where: { c_seq: c_seq } });
    });

    // 클라이언트로부터 메세지 수신
    socket.on("sendMessage", async ({ c_seq, content, u_seq, isread }) => {
        const message = await db.Message.create({ c_seq, content, u_seq, isread }); // 메세지를 DB에 저장
        // 서버 -> 클라이언트 메세지 송신
        io.to(`chatroom-${c_seq}`).emit("newMessage", message); // 해당 채팅방에 참여한 모든 클라이언트에게 emit
    });

    // 채팅방 나가기
    socket.on("leave", (c_seq) => {
        socket.leave(`chatroom-${c_seq}`);
    });
});

app.get("*", (req, res) => {
    res.render("404");
});

db.sequelize.sync({ force: false }).then((result) => {
    console.log("DB연결 성공");
});

server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
    console.log(`http://49.50.164.79:${PORT}`);
});
