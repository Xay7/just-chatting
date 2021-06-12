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
    const User_Chatroom = require(join(__dirname, "../models/User_Chatroom"))(
        sequelize,
        DataTypes
    )

    User.hasMany(Chatroom, { foreignKey: "user_id" })
    Chatroom.belongsTo(User, { foreignKey: "owner_id" })
    Chatroom.belongsToMany(User, {
        through: User_Chatroom,
        foreignKey: "chatroom_id",
        as: "members",
    })
    User.belongsToMany(Chatroom, {
        foreignKey: "member_id",
        as: "members",
        through: "User_Chatroom",
    })

    Chatroom.hasMany(Channel, { foreignKey: "chatroomId" })
    Channel.belongsTo(Chatroom, { foreignKey: "chatroomId" })

    Channel.hasMany(ChannelMessage, { foreignKey: "channelId" })
    ChannelMessage.belongsTo(Channel, { foreignKey: "channelId" })

    return {
        User,
        Chatroom,
        Channel,
        ChannelMessage,
        User_Chatroom,
    }
}
