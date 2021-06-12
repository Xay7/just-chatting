module.exports = (sequelize) => {
    const { Chatroom, Channel } = sequelize.models

    const chatrooms = async (req, res, next) => {
        const foundChatrooms = await Chatroom.findAll()
        console.log("czatrumy")
        console.log(foundChatrooms)

        const formattedChatrooms = foundChatrooms.map((el) => ({
            id: el.id,
            name: el.name,
        }))

        console.log("sfromatowane czatrumy")
        console.log(formattedChatrooms)

        res.json({
            chatrooms: formattedChatrooms,
        })
    }

    const newChatroom = async (req, res, next) => {
        const name = !req.body.name ? "" : req.body.name.trim()

        const chatroom = await Chatroom.create({
            name: name,
            ownerId: req.user.id,
        })

        console.log("chatroom: ")
        console.log(chatroom)

        const channel = await Channel.create({
            name: "General",
            chatroomId: chatroom.id,
        })

        console.log("channel")
        console.log(channel)

        // 201 -> created
        res.status(201).json({ id: chatroom.id, name: chatroom.name })
    }

    const joinChatroom = async (req, res, next) => {
        const id = req.params.id
        const user_id = req.user._id

        const foundUser = await User.findById({ _id: user_id })

        const userChatrooms = foundUser.chatrooms

        // Make sure user can't join arleady joined rooms

        if (userChatrooms.includes(id)) {
            return res
                .status(409)
                .json({ error: "You arleady joined this chatroom" })
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid chatroom ID" })
        }

        const foundChatroom = await Chatroom.findOne({ _id: id })

        if (!foundChatroom) {
            return res.status(403).json({ error: "Chatroom doesn't exist" })
        }

        await User.findByIdAndUpdate(
            { _id: user_id },
            {
                $push: {
                    chatrooms: foundChatroom._id,
                },
            }
        )

        await Chatroom.findOneAndUpdate(
            { _id: id },
            {
                $push: {
                    members: foundUser._id,
                },
            }
        )

        res.status(200).json({
            id: foundChatroom._id,
            name: foundChatroom.name,
        })
    }

    const leaveChatroom = async (req, res, next) => {
        const id = req.params.id
        const user_id = req.user._id

        await Chatroom.findOneAndUpdate(
            { _id: id },
            {
                $pull: {
                    members: user_id,
                },
            }
        )

        await User.findOneAndUpdate(
            { _id: user_id },
            {
                $pull: {
                    chatrooms: id,
                },
            }
        )

        res.status(200).json("good")
    }

    const deleteChatroom = async (req, res, next) => {
        const id = req.params.id
        const user_id = req.user._id

        // Check if request is from owner
        const foundOwner = await Chatroom.findOne({ _id: id })

        if (!user_id.equals(foundOwner.owner)) {
            return res.status(403).json({ error: "Unauthorized" })
        }

        // Delete chatroom
        await Chatroom.findOneAndDelete({ id })

        // Delete chatroom channels
        await Channel.deleteMany({ chatroom_id: id })

        // Find room clients and delete all id's
        await User.updateMany(
            { chatrooms: id },
            {
                $pull: {
                    chatrooms: id,
                },
            }
        )

        res.status(200).json({ success: "Chat has been deleted" })
    }

    const getChatroomData = async (req, res, next) => {
        const id = req.params.id

        const chatroom = await Chatroom.findOne({
            where: { id, userId: req.user.id },
        })

        console.log("chatroom")
        console.log(chatroom)

        // .populate([
        //     { path: "members", select: "name avatar _id" },
        //     { path: "owner", select: "name" },
        // ])

        if (!foundChatroom) {
            return res.status(404).json({ error: "Chatroom doesn't exist" })
        }
        const foundChannels = await Channel.find(
            { chatroom_id: id },
            { chatroom_id: false, __v: false }
        )

        const data = {
            id: foundChatroom._id,
            name: foundChatroom.name,
            owner: {
                name: foundChatroom.owner.name,
                id: foundChatroom.owner._id,
            },
            members: foundChatroom.members,
            channels: foundChannels,
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
