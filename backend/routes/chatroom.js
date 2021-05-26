const socket = require("../socket")
const express = require("express")
const router = require("express-promise-router")()
const passport = require("passport")
const ChatroomController = require("../controllers/chatrooms")
const ChannelController = require("../controllers/channels")
const passportJWT = passport.authenticate("jwt", { session: false })

router.route("/").post(passportJWT, ChatroomController.newChatroom)

router
    .route("/:id")
    .delete(passportJWT, ChatroomController.deleteChatroom)
    .put(passportJWT, ChatroomController.joinChatroom)
    .patch(passportJWT, ChatroomController.leaveChatroom)
    .get(passportJWT, ChatroomController.getChatroomData)

router.route("/:id/channels").get(passportJWT, ChannelController.getChannels)

module.exports = router
