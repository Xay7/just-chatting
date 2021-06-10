module.exports = (sequelize, DataTypes) => {
    const ChannelMessage = sequelize.define("ChannelMessage", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrementation: true,
            unique: true,
            allowNull: true,
        },
        body: {
            type: DataTypes.STRING,
            required: true,
        },
    })

    return ChannelMessage
}
