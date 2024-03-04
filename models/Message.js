// 메세지 관련 모델
const Message = (Sequelize, DataTypes) => {
    return Sequelize.define(
        "Message",
        {
            m_seq: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            c_seq: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            u_seq: {
                // 현재 접속 유저
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            content: {
                // 메세지 내용
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            isread: {
                // 읽음 여부
                type: DataTypes.TINYINT(1),
                allowNull: false,
            },
        },
        {
            tableName: "message",
            freezeTableName: true,
            timestamps: true,
        }
    );
};

module.exports = Message;
