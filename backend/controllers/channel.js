module.exports = (sequelize) => {
    const { Channel } = sequelize.models

    const newChannel = async (req, res, next) => {
        const chatroom = req.body.id
        const name = req.body.name
        const description = req.body.description

        const newChannel = new Channel({
            chatroom_id: chatroom,
            name: name,
            description: description,
        })

        await newChannel.save()

        res.status(200).json({
            success: "Created new channel",
            id: newChannel.id,
        })
    }

    const getChannels = async (req, res, next) => {
        const channels = await Chatroom.findOne(
            { id: req.params.id },
            { _id: 0 }
        ).select("channels")

        res.status(200).json(channels)
    }

    const getChannel = async (req, res, next) => {
        const id = req.params.id

        const channel = await Channel.findById(id, { chatroom_id: false })

        res.status(200).json(channel)
    }

    const changeChannelData = async (req, res, next) => {
        const id = req.params.id

        let newChannelName = req.body.channelName
        const newChannelDescription = req.body.channelDescription

        if (newChannelName == "") {
            newChannelName = req.body.oldChannelName
        }

        await Channel.findByIdAndUpdate(
            { _id: id },
            {
                name: newChannelName,
                description: newChannelDescription,
            }
        )

        res.status(200).json({ success: "Channel data has been changed" })
    }

    const deleteChannel = async (req, res, next) => {
        const user_id = req.user._id
        const channelID = req.params.id

        const foundChannel = await Channel.findById({ _id: channelID })

        if (!foundChannel) {
            res.status(404).json({ error: "Channel doesn't exist" })
        }

        const isOwner = await Chatroom.findById(foundChannel.chatroom_id)

        if (isOwner.owner.toString() !== user_id.toString()) {
            return res.status(403).json({ error: "Unauthorized" })
        }

        await Channel.deleteOne({ _id: channelID })

        res.status(200).json({ success: "Channel has been deleted" })
    }

    const storeMessage = async (req, res, next) => {
        const newChannelMessage = new ChannelMessage({
            channel_id: req.body.id,
            author: req.user._id,
            body: req.body.body,
            created_at: req.body.created_at,
        })

        newChannelMessage.save()

        res.status(200).json({ success: "Stored a message" })
    }

    const getMessages = async (req, res, next) => {
        const amount = +req.query.amount
        const skip = +req.query.skip

        const foundMessages = await ChannelMessage.find({
            channel_id: req.params.id,
        })
            .sort({ _id: -1 })
            .limit(amount)
            .skip(skip)
            .populate("author", "name avatar -_id")

        res.status(200).json(foundMessages)
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
