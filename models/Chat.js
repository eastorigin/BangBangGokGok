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
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            b_seq: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            c_title1: {
                type: DataTypes.STRING(36),
                allowNull: false,
            },
            c_title2: {
                type: DataTypes.STRING(36),
                allowNull: false,
            },
            unreadcnt: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            last_user: {
                type: DataTypes.INTEGER,
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
