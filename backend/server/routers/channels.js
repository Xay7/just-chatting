const express = require("express")
const router = express.Router()

module.exports = (sequelize) => {
    const ChannelController = require("../../controllers/channel")(sequelize)

    router.get("/", ChannelController.newChannel)
    router.post("/", ChannelController.getChannel)

    router.put("/:id", ChannelController.changeChannelData)
    router.get("/:id", ChannelController.getChannel)
    router.delete("/:id", ChannelController.deleteChannel)

    router.put("/:id/messages", ChannelController.storeMessage)
    router.get("/:id/messages", ChannelController.getMessages)

    return router
}
