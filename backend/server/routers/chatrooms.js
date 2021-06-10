const { app, io } = require("../../bin/www")
const socket = io
const express = require("express")
const router = express.Router()
const passport = require("passport")

const passportJWT = passport.authenticate("jwt", { session: false })

module.exports = (sequelize) => {
    const ChatroomController = require("../../controllers/chatroom")(sequelize)
    const ChannelController = require("../../controllers/channel")(sequelize)

    router.delete("/:id", passportJWT, ChatroomController.deleteChatroom)
    router.put("/:id", passportJWT, ChatroomController.joinChatroom)
    router.patch("/:id", passportJWT, ChatroomController.leaveChatroom)
    router.get("/:id", passportJWT, ChatroomController.getChatroomData)

    router
        .route("/:id/channels")
        .get(passportJWT, ChannelController.getChannels)

    return router
}
