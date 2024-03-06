// 좋아요 관련 모델
const Likes = (Sequelize, DataTypes) => {
    return Sequelize.define(
        "Likes",
        {
            l_seq: {
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
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },

        {
            tableName: "likes",
            freezeTableName: true,
            timestamps: false,
        }
    );
};

module.exports = Likes;
