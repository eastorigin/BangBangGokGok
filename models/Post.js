// 게시글 관련 모델
const Post = (Sequelize, DataTypes) => {
    return Sequelize.define(
        "Post",
        {
            p_seq: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            title: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            content: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            date: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn("NOW"),
            },
            file: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            category: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            is_success: {
                type: DataTypes.BOOLEAN, // 1: true(거래완료), 0: false(거래안완료)
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            tableName: "post",
            freezeTableName: true,
            timestamps: false,
        }
    );
};

module.exports = Post;
