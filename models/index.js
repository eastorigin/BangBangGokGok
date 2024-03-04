"use strict";

const Sequelize = require("sequelize");
const config = require(__dirname + "/../config/config.js")["development"];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const UserModel = require("./User")(sequelize, Sequelize);
const ChatModel = require("./Chat")(sequelize, Sequelize);
const MessageModel = require("./Message")(sequelize, Sequelize);

// User:Chat = 1:N
UserModel.hasMany(ChatModel, {
    sourceKey: "u_seq",
    foreignKey: "u_seq",
});
ChatModel.belongsTo(UserModel, {
    target: "u_seq",
    foreignKey: "u_seq",
});

// User:Message = 1:N
UserModel.hasMany(MessageModel, {
    sourceKey: "u_seq",
    foreignKey: "u_seq",
});
MessageModel.belongsTo(UserModel, {
    target: "u_seq",
    foreignKey: "u_seq",
});

// Chat:Message = 1:N
ChatModel.hasMany(MessageModel, {
    sourceKey: "c_seq",
    foreignKey: "c_seq",
});
MessageModel.belongsTo(ChatModel, {
    target: "c_seq",
    foreignKey: "c_seq",
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = UserModel;
db.Chat = ChatModel;
db.Message = MessageModel;

module.exports = db;
