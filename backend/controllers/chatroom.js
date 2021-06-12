module.exports = (sequelize) => {
    const { Chatroom, Channel, User_Chatrooms } = sequelize.models

    const chatrooms = async (req, res, next) => {
        const userId = req.user.id

        let userChatrooms = await Chatroom.findAll({
            where: { owner_id: userId },
        })

        const userChatrooms = foundChatrooms.map((el) => ({
            id: el.id,
            name: el.name,
        }))

        res.json({
            chatrooms: userChatrooms,
        })
    }

    const newChatroom = async (req, res, next) => {
        const name = !req.body.name ? "" : req.body.name.trim()

        const chatroom = await Chatroom.create({
            name: name,
            ownerId: req.user.id,
        })

        await Channel.create({
            name: "General",
            chatroomId: chatroom.id,
        })

        res.status(201).json({ id: chatroom.id, name: chatroom.name })
    }

    const joinChatroom = async (req, res, next) => {
        const chatroomId = !req.params.id ? "" : req.params.id.trim()
        const userId = req.user.id

        const userChatrooms = await Chatroom.findAll({
            where: {
                owner_id: userId,
            },
        })

        // Make sure user can't join arleady joined rooms

        const isUserJoined = userChatrooms.some(
            (chatroom) => chatroom["owner_id"] == chatroomId
        )

        if (isUserJoined) {
            return res
                .status(409)
                .json({ error: "You arleady joined this chatroom" })
        }

        const chatroomExists = await Chatroom.findOne({
            where: {
                id: chatroomId,
            },
        })

        if (!chatroomExists) {
            return res.status(403).json({ error: "Chatroom doesn't exist" })
        }

        const member = await User_Chatrooms.create({
            where: {
                chatroom_id: chatroomId,
            },
        })

        const chatroom = userChatrooms
            .filter(chatroom["owner_id"] == chatroomId)
            .shift()

        res.status(200).json({
            id: chatroom.id,
            name: chatroom.name,
        })
    }

    const leaveChatroom = async (req, res, next) => {
        const chatroomId = req.params.id
        const userId = req.user.id

        const chatroom = await Chatroom.findOne({
            where: { id: chatroomId, owner_id: userId },
        })

        if (!chatroom) {
            res.status(404).json({ error: "It's not your chatroom" })
        }

        res.status(200).json("good")
    }

    const deleteChatroom = async (req, res, next) => {
        const chatroomId = req.params.id
        const userId = req.user.id

        // Check if request is from owner
        const chatroomOwner = await Chatroom.findOne({
            where: {
                owner_id: userId,
            },
        })

        if (!chatroomOwner.owner_id == userId) {
            return res.status(403).json({ error: "Unauthorized" })
        }

        // Delete chatroom channels
        const chatroomChannels = Channel.findAll({
            where: {
                chatroom_id: chatroomId,
            },
        })

        for (const channel of chatroomChannels) {
            channel.destroy()
        }

        // Delete chatroom
        await chatroom.destroy()

        res.status(200).json({ success: "Chat has been deleted" })
    }

    const getChatroomData = async (req, res, next) => {
        const chatroomId = req.params.id
        const userId = req.user.id

        const chatroom = await Chatroom.findOne({
            where: { id: chatroomId, owener_id: req.user.id },
            include: ["members", "channel"],
        })

        if (!chatroom) {
            return res.status(404).json({ error: "Chatroom doesn't exist" })
        }

        const channels = chatroom.channel
        const members = chatroom.members

        const data = {
            id: chatroom.id,
            name: chatroom.name,
            owner: {
                id: foundChatroom.owner.id,
                name: chatroom.owner.name,
            },
            members,
            channels,
        }
        res.status(200).json(data)
    }

    const getChatroomdUsers = async (req, res, next) => {
        const chatroomId = req.params.id

        const users = User.findById()
    }

    return {
        chatrooms,
        newChatroom,
        joinChatroom,
        leaveChatroom,
        deleteChatroom,
        getChatroomData,
    }
}
