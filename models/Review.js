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
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            sender: {
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
