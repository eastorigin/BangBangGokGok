// 리뷰 관련 모델
const Review = (Sequelize, DataTypes) => {
    return Sequelize.define(
        "Review",
        {
            r_seq: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            u_seq: {
                // 평가 받는 유저 seq
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            sender: {
                // 평가 하는 사람 seq
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            score: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: "review",
            freezeTableName: true,
            timestamps: false,
        }
    );
};

module.exports = Review;
