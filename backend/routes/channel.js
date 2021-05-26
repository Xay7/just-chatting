const socket = require("../socket")
const express = require("express")
const router = require("express-promise-router")()
const passport = require("passport")
const passportConfig = require("../passport")
const ChannelController = require("../controllers/channels")
const passportJWT = passport.authenticate("jwt", { session: false })

router
    .route("/")
    .post(passportJWT, ChannelController.newChannel)
    .get(passportJWT, ChannelController.getChannels)

router
    .route("/:id")
    .put(passportJWT, ChannelController.changeChannelData)
    .get(passportJWT, ChannelController.getChannel)
    .delete(passportJWT, ChannelController.deleteChannel)

router
    .route("/:id/messages")
    .put(passportJWT, ChannelController.storeMessage)
    .get(passportJWT, ChannelController.getMessages)

module.exports = router
