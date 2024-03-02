const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT;
const db = require("./models");

app.set("view engine", "ejs");
app.set("views", "./views");
app.use("/static", express.static(__dirname + "/static"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const indexRouter = require("./routes/index");
app.use("/", indexRouter);

const userRouter = require("./routes/user");
app.use("/users", userRouter);

const chatRouter = require("./routes/chat");
app.use("/chats", chatRouter);

app.get("*", (req, res) => {
    res.render("404");
});

db.sequelize.sync({ force: false }).then((result) => {
    console.log("DB연결 성공");
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
