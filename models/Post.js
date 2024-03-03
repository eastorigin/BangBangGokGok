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
            },
            file: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            category: {
                type: DataTypes.STRING(20),
                allowNull: false,
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
