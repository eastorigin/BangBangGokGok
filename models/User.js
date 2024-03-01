// 유저 관련 모델
const User = function (Sequelize, DataTypes) {
    return Sequelize.define(
        "User",
        {
            u_seq: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            u_id: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            u_pw: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            u_nick: {
                type: DataTypes.STRING(36),
                allowNull: false,
            },
            u_name: {
                type: DataTypes.STRING(36),
                allowNull: false,
            },
            u_email: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
        },
        {
            table: "user",
            freezeTableName: true,
            timestamps: false,
        }
    );
};

module.exports = User;
