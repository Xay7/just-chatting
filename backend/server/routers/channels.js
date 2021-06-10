const { app, io } = require("../../bin/www")
const socket = io
const express = require("express")
const router = express.Router()
const passport = require("passport")
// const passportConfig = require("../../passport")

const passportJWT = passport.authenticate("jwt", { session: false })

module.exports = (sequelize) => {
    const ChannelController = require("../../controllers/channel")(sequelize)

    router.get("/", passportJWT, ChannelController.newChannel)
    router.post("/", passportJWT, ChannelController.getChannel)

    router.put("/:id", passportJWT, ChannelController.changeChannelData)
    router.get("/:id", passportJWT, ChannelController.getChannel)
    router.delete("/:id", passportJWT, ChannelController.deleteChannel)

    router.put("/:id/messages", passportJWT, ChannelController.storeMessage)
    router.get("/:id/messages", passportJWT, ChannelController.getMessages)

    return router
}
