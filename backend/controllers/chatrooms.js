const User = require('../models/user');
const Chatroom = require('../models/chatroom');
const Channel = require('../models/channel');

module.exports = {
    chatrooms: async (req, res, next) => {

        const chatrooms = req.user.local.chatRooms

        const foundChatrooms = await Chatroom.find().where('_id').in(chatrooms);

        const formattedChatrooms = foundChatrooms.map(el => {
            return {
                id: el._id,
                name: el.name
            }
        })

        res.status(200).json({
            chatRooms: formattedChatrooms
        })

    },
    newChatroom: async (req, res, next) => {

        const name = req.body.name
        const owner = req.user.local.name

        const newChatroom = new Chatroom({
            name: name,
            owner: owner,
            members: {
                member: owner,
                joined_at: new Date(),
            }
        })

        const newChannel = new Channel({
            chatroom_id: newChatroom._id,
            name: 'General'
        })

        await newChatroom.save();
        await newChannel.save();

        await User.findOneAndUpdate({ "local.name": owner }, {
            "$push":
            {
                "local.chatRooms": newChatroom._id
            }
        })

        res.status(201).json({ success: "New chat has been created" })
    },
    joinChatroom: async (req, res, next) => {

        const id = req.body.id;
        const username = req.body.username

        const foundUser = await User.findOne({ "local.name": username });

        const userChatrooms = foundUser.local.chatRooms

        // Make sure user can't join arleady joined rooms

        if (userChatrooms.includes(id)) {
            return res.status(409).json({ error: "Can't join owned room" })
        }

        const foundChatroom = await Chatroom.findOne({ "id": id });

        if (!foundChatroom) {
            return res.status(403).json({ error: "Chat doesn't exist" });
        }

        await User.findOneAndUpdate({ "local.name": username }, {
            "$push":
            {
                "local.chatRooms": id
            }
        })

        await Chatroom.findOneAndUpdate({ "id": id }, {
            "$push":
            {
                "members": {
                    subscriber: username,
                    joined_at: new Date(),
                }
            }
        })

        res.status(200).json({ "success": "Joined chatroom" });
    },
    deleteChatroom: async (req, res, next) => {

        const id = req.params.id;
        const username = req.user.local.name;

        // Check if request is from owner
        const foundOwner = await Chatroom.findOne({ "_id": id });

        if (username !== foundOwner.owner) {
            return res.status(403).json({ error: "Unauthorized" })
        }

        // Delete chatroom
        await Chatroom.findOneAndDelete({ "_id": id });

        // Delete chatroom channels
        await Channel.deleteMany({ "chatroom_id": id });

        // Find room clients and delete all id's
        await User.updateMany({ "local.chatRooms": id }, {
            $pull: {
                "local.chatRooms": id
            }
        });

        res.status(200).json({ success: "Chat has been deleted" })
    },
    getChatroomData: async (req, res, next) => {

        const id = req.params.id;

        const foundChatroom = await Chatroom.findOne({ "_id": id }, function (err) {
            if (err) {
                return res.status(404).json({ error: "Wrong id format" });
            }
        }).select("owner members");

        if (!foundChatroom) {
            return res.status(404).json({ error: "Chatroom doesn't exist" });
        }

        const foundChannels = await Channel.find({ "chatroom_id": id }, { "chatroom_id": false, __v: false });

        const data = {
            owner: foundChatroom.owner,
            members: foundChatroom.members,
            channels: foundChannels
        }

        res.status(200).json(data);

    },
}