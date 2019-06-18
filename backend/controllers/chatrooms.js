const User = require('../models/user');
const Chatroom = require('../models/chatroom');
const Channel = require('../models/channel');

module.exports = {
    chatrooms: async (req, res, next) => {

        const chatrooms = req.user.chatrooms

        const foundChatrooms = await Chatroom.find().where('_id').in(chatrooms);

        const formattedChatrooms = foundChatrooms.map(el => {
            return {
                id: el._id,
                name: el.name
            }
        })

        res.status(200).json({
            chatrooms: formattedChatrooms
        })

    },
    newChatroom: async (req, res, next) => {

        const name = req.body.name
        const id = req.user._id

        const newChatroom = new Chatroom({
            name: name,
            owner: id,
            members: id
        })

        const newChannel = new Channel({
            chatroom_id: newChatroom._id,
            name: 'General'
        })

        await newChatroom.save();
        await newChannel.save();

        await User.findOneAndUpdate({ "_id": id }, {
            "$push":
            {
                "chatrooms": newChatroom._id
            }
        })

        res.status(201).json({ id: newChatroom._id, name: newChatroom.name })
    },
    joinChatroom: async (req, res, next) => {

        const id = req.params.id;
        const user_id = req.user._id

        const foundUser = await User.findById({ "_id": user_id });

        const userChatrooms = foundUser.chatrooms

        // Make sure user can't join arleady joined rooms

        if (userChatrooms.includes(id)) {
            return res.status(409).json({ error: "Can't join owned room" })
        }

        const foundChatroom = await Chatroom.findOne({ "_id": id });

        if (!foundChatroom) {
            return res.status(403).json({ error: "Chat doesn't exist" });
        }

        await User.findByIdAndUpdate({ "_id": user_id }, {
            "$push":
            {
                "chatrooms": foundChatroom._id
            }
        })

        await Chatroom.findOneAndUpdate({ "_id": id }, {
            "$push":
            {
                "members": foundUser._id
            }
        })

        res.status(200).json({ id: foundChatroom._id, name: foundChatroom.name });
    },
    leaveChatroom: async (req, res, next) => {

        const id = req.params.id;
        const user_id = req.user._id

        await Chatroom.findOneAndUpdate({ "_id": id }, {
            $pull: {
                "members": user_id
            }
        })

        await User.findOneAndUpdate({ "_id": user_id }, {
            $pull: {
                "chatrooms": id
            }
        })

        res.status(200).json("good");
    },
    deleteChatroom: async (req, res, next) => {

        const id = req.params.id;
        const user_id = req.user._id;

        // Check if request is from owner
        const foundOwner = await Chatroom.findOne({ "_id": id });

        if (!user_id.equals(foundOwner.owner)) {
            return res.status(403).json({ error: "Unauthorized" })
        }

        // Delete chatroom
        await Chatroom.findOneAndDelete({ "_id": id });

        // Delete chatroom channels
        await Channel.deleteMany({ "chatroom_id": id });

        // Find room clients and delete all id's
        await User.updateMany({ "chatrooms": id }, {
            $pull: {
                "chatrooms": id
            }
        });

        res.status(200).json({ success: "Chat has been deleted" })
    },
    getChatroomData: async (req, res, next) => {

        const id = req.params.id;

        const foundChatroom = await Chatroom.findOne({ "_id": id }).populate([{ path: 'members', select: 'name avatar _id' }, { path: 'owner', select: 'name' }]);
        if (!foundChatroom) {
            return res.status(404).json({ error: "Chatroom doesn't exist" });
        }
        const foundChannels = await Channel.find({ "chatroom_id": id }, { "chatroom_id": false, __v: false });

        const data = {
            id: foundChatroom._id,
            name: foundChatroom.name,
            owner: {
                name: foundChatroom.owner.name,
                id: foundChatroom.owner._id
            },
            members: foundChatroom.members,
            channels: foundChannels
        }

        res.status(200).json(data);
    },
}