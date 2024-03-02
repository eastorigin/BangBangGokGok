// 채팅 관련 모델
const Chat = (Sequelize, DataTypes) => {
    return Sequelize.define(
        "Chat",
        {
            c_seq: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            p_seq: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            u_seq: {
                // 채팅방 생성자
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            b_seq: {
                // 구매자(= 글 작성자)
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            c_title: {
                // 채팅방 제목
                type: DataTypes.STRING(36),
                allowNull: false,
            },
        },
        {
            tableName: "chat",
            freezeTableName: true,
            timestamps: true,
        }
    );
};

module.exports = Chat;
