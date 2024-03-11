const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const { Op } = require("sequelize");

const multer = require("multer");
const path = require("path");

const app = express();
const server = http.createServer(app); // 서버 객체 생성
const io = socketIO(server);
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT;
const db = require("./models");
const jwt = require("jsonwebtoken");

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

const likesRouter = require("./routes/likes");
app.use("/likes", likesRouter);

const reviewRouter = require("./routes/review");
app.use("/reviews", reviewRouter);

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

const uploadDetail = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "uploads/");
        },

        filename: function (req, file, done) {
            const extension = path.extname(file.originalname);
            done(null, path.basename(file.originalname, extension) + Date.now() + extension);
        },
    }),
});

// 파일 업로드를 처리하는 라우터 추가
app.post("/upload", uploadDetail.single("file"), async (req, res) => {
    try {
        // 토큰과 파일 처리 관련 수정
        if (!req.headers.authorization)
            return res.status(401).send("No authorization token provided.");

        const accessToken = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_SECRET);

        // 파일 업로드 처리가 필수가 아닌 경우, 파일 정보가 없어도 처리를 계속 진행
        const filename = req.file ? req.file.filename : "";
        const filepath = req.file ? req.file.path : "";

        const { title, content, category } = req.body;
        if (!title || !content || !category) {
            return res.status(400).send("Missing required fields.");
        }

        const u_seq = decodedToken.u_seq;
        const post = await db.Post.create({
            title,
            content,
            file: filename, // 파일명 저장 (파일이 없으면 빈 문자열 저장)
            category,
            u_seq,
        });

        res.status(201).send(post);
    } catch (error) {
        console.error("파일 업로드 중 에러 발생:", error);
        res.status(500).send("파일 업로드에 실패했습니다.");
    }
});

server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
    console.log(`http://49.50.164.79:${PORT}`);
});
