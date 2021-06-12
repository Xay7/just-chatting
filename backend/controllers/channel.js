module.exports = (sequelize) => {
    const { Channel, ChannelMessage } = sequelize.models

    const newChannel = async (req, res, next) => {
        const chatroomId = req.body.id
        const channelName = req.body.name
        const channelDescription = req.body.description

        const channel = Channel.create({
            chatroom_id: chatroom,
            name: channelName,
            description: channelDescription,
        })

        if (channel) {
            res.status(200).json({
                success: "Created new channel",
                id: newChannel.id,
            })
        } else {
            res.status(500).json("error")
        }
    }

    const getChannels = async (req, res, next) => {
        const chatroomId = req.params.id
        const channels = await Chatroom.findOne({
            where: {
                chatroom_id: chatroomId,
            },
        })

        res.status(200).json(channels)
    }

    const getChannel = async (req, res, next) => {
        const id = req.params.id

        const channel = await Channel.findById(id, { chatroom_id: false })

        res.status(200).json(channel)
    }

    const changeChannelData = async (req, res, next) => {
        const channelId = req.params.id
        let channelName = req.body.channelName
        const channelDescription = req.body.channelDescription

        if (newChannelName == "") {
            newChannelName = req.body.oldChannelName
        }

        const channel = Channel.findOne({
            where: {
                id: channelId,
            },
        })

        if (!channel) {
            res.status(404).json("channel not found")
        }

        channel.name = channelName
        channel.description = channelDescription
        await channel.save()

        res.status(200).json({ success: "Channel data has been changed" })
    }

    const deleteChannel = async (req, res, next) => {
        const userId = req.user._id
        const channelId = req.params.id

        const channel = await Channel.findOne({
            where: {
                id: channelId,
            },
        })

        if (!channel) {
            res.status(404).json({ error: "Channel doesn't exist" })
        }

        const isOwner = await Chatroom.find({
            where: {
                id: channel.chatroom_id,
                ownerId: req.user.id,
            },
        })

        if (!isOwner) {
            return res.status(403).json({ error: "Unauthorized" })
        }

        await channel.destroy()

        res.status(200).json({ success: "Channel has been deleted" })
    }

    const storeMessage = async (req, res, next) => {
        const channelId = req.body.id
        const author = req.user.id
        const body = requ.body.body
        const created_at = req.body.created_at

        const channelMessage = await ChannelMessage.create({
            where: {
                channel_id: channelId,
                author,
                body,
                created_at,
            },
        })

        res.status(200).json({ success: "Stored a message" })
    }

    const getMessages = async (req, res, next) => {
        const channelId = req.params.id
        const amount = +req.query.amount
        const skip = +req.query.skip

        const messages = await ChannelMessage.findAll({
            where: {
                channel_id: channelId,
            },
            limit: amount,
            offset: skip,
            order: [["id", "DESC"]],
        })

        res.status(200).json(messages)
    }

    return {
        newChannel,
        getChannel,
        getChannels,
        changeChannelData,
        deleteChannel,
        storeMessage,
        getMessages,
    }
}
