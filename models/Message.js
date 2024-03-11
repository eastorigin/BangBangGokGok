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
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            content: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            isread: {
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
