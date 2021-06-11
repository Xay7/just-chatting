// const { app, io } = require("../../bin/www")
// const socket = io

const express = require("express")
const router = express.Router()

module.exports = (sequelize) => {
    const ChatroomController = require("../../controllers/chatroom")(sequelize)
    const ChannelController = require("../../controllers/channel")(sequelize)

    router.post("/", ChatroomController.newChatroom)

    router.get("/:id", ChatroomController.getChatroomData)
    router.delete("/:id", ChatroomController.deleteChatroom)
    router.put("/:id", ChatroomController.joinChatroom)
    router.patch("/:id", ChatroomController.leaveChatroom)

    router.get("/:id/channels", ChannelController.getChannels)

    return router
}
