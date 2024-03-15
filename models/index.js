"use strict";

const Sequelize = require("sequelize");
console.log("crossenv", process.env.NODE_ENV);
let config;
if (process.env.NODE_ENV) {
    // npm run dev, npm start
    config = require(__dirname + "/../config/config.js")[process.env.NODE_ENV];
} else {
    // node app.js
    config = require(__dirname + "/../config/config.js")["development"];
}
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const UserModel = require("./User")(sequelize, Sequelize);
const ChatModel = require("./Chat")(sequelize, Sequelize);
const MessageModel = require("./Message")(sequelize, Sequelize);
const PostModel = require("./Post")(sequelize, Sequelize);
const LikesModel = require("./Likes")(sequelize, Sequelize);
const ReviewModel = require("./Review")(sequelize, Sequelize);

UserModel.hasMany(PostModel, {
    sourceKey: "u_seq",
    foreignKey: "u_seq",
});
PostModel.belongsTo(UserModel, {
    target: "u_seq",
    foreignKey: "u_seq",
});

UserModel.hasMany(ChatModel, {
    sourceKey: "u_seq",
    foreignKey: "u_seq",
});
ChatModel.belongsTo(UserModel, {
    target: "u_seq",
    foreignKey: "u_seq",
});

UserModel.hasMany(MessageModel, {
    sourceKey: "u_seq",
    foreignKey: "u_seq",
});
MessageModel.belongsTo(UserModel, {
    target: "u_seq",
    foreignKey: "u_seq",
});

ChatModel.hasMany(MessageModel, {
    sourceKey: "c_seq",
    foreignKey: "c_seq",
});
MessageModel.belongsTo(ChatModel, {
    target: "c_seq",
    foreignKey: "c_seq",
});

UserModel.hasMany(LikesModel, {
    sourceKey: "u_seq",
    foreignKey: "u_seq",
});
LikesModel.belongsTo(UserModel, {
    target: "u_seq",
    foreignKey: "u_seq",
});

PostModel.hasMany(LikesModel, {
    sourceKey: "p_seq",
    foreignKey: "p_seq",
});
LikesModel.belongsTo(PostModel, {
    target: "p_seq",
    foreignKey: "p_seq",
});

UserModel.hasMany(ReviewModel, {
    sourceKey: "u_seq",
    foreignKey: "u_seq",
});
ReviewModel.belongsTo(UserModel, {
    target: "u_seq",
    foreignKey: "u_seq",
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = UserModel;
db.Chat = ChatModel;
db.Message = MessageModel;
db.Post = PostModel;
db.Likes = LikesModel;
db.Review = ReviewModel;

module.exports = db;
