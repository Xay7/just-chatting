const { join } = require("path")

module.exports = (sequelize, DataTypes) => {
    const User = require(join(__dirname, "../models/User"))(
        sequelize,
        DataTypes
    )
    const Chatroom = require(join(__dirname, "../models/Chatroom"))(
        sequelize,
        DataTypes
    )
    const Channel = require(join(__dirname, "../models/Channel"))(
        sequelize,
        DataTypes
    )
    const ChannelMessage = require(join(__dirname, "../models/ChannelMessage"))(
        sequelize,
        DataTypes
    )

    User.hasMany(Chatroom)

    Chatroom.belongsTo(User)
    Chatroom.hasMany(Channel)

    Channel.belongsTo(Chatroom)
    Channel.hasMany(ChannelMessage)

    ChannelMessage.belongsTo(Channel)

    return {
        User,
        Chatroom,
        Channel,
        ChannelMessage,
    }
}
