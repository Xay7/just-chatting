const Chatroom = require('../models/chatroom');
const Channel = require('../models/channel');

module.exports = {
    newChannel: async (req, res, next) => {

        const chatroom = req.body.id;
        const name = req.body.name
        const description = req.body.description

        const newChannel = new Channel({
            chatroom_id: chatroom,
            name: name,
            description: description
        })

        await newChannel.save();

        res.status(200).json({ success: "Created new channel", id: newChannel.id });
    },
    getChannels: async (req, res, next) => {

        const channels = await Chatroom.findOne({ "id": req.params.id }, { "_id": 0 }).select("channels")

        res.status(200).json(channels)
    },
    getChannel: async (req, res, next) => {

        const id = req.params.id;

        const channel = await Channel.findById(id, { "chatroom_id": false });

        res.status(200).json(channel);;
    },
    changeChannelData: async (req, res, next) => {

        const id = req.params.id;

        let newChannelName = req.body.channelName;
        const newChannelDescription = req.body.channelDescription

        if (newChannelName == '') {
            newChannelName = req.body.oldChannelName;
        }

        await Channel.findByIdAndUpdate({ "_id": id }, {
            name: newChannelName,
            description: newChannelDescription
        })

        res.status(200).json({ success: "Channel data has been changed" })
    },
    deleteChannel: async (req, res, next) => {

        const reqUserName = req.user.name
        const channelID = req.params.id;

        const foundChannel = await Channel.findById({ "_id": channelID });

        if (!foundChannel) {
            res.status(404).json({ error: "Channel doesn't exist" });
        }

        const isOwner = await Chatroom.findById(foundChannel.chatroom_id);

        if (isOwner.owner !== reqUserName) {
            return res.status(403).json({ error: "Unauthorized" })
        }

        await Channel.deleteOne({ "_id": channelID });

        res.status(200).json({ success: "Channel has been deleted" })
    },
    storeMessage: async (req, res, next) => {

        const username = req.user.name;
        const id = req.params.id;

        const data = {
            author: username,
            body: req.body.body,
            created_at: req.body.created_at,
            avatar: req.body.avatar
        }

        await Chatroom.findOneAndUpdate({ "id": id, "channels.id": req.params.channelID }, {
            "$push":
            {
                "channels.$.messages": data
            }
        });

        res.status(200).json({ success: "Stored a message" });

    },
    getMessages: async (req, res, next) => {

        const id = req.params.id;
        const channelID = req.params.channelID;
        const skip = +req.query.skip;
        const amount = +req.query.amount;

        const result = await Chatroom.aggregate(
            (
                [
                    {
                        "$match": {
                            "id": id
                        }
                    },
                    {
                        "$unwind": "$channels"
                    },
                    {
                        "$match": {
                            "channels.id": channelID
                        }
                    },
                    {
                        "$project": {
                            "_id": 0,
                            "messages": {
                                "$slice": [
                                    {
                                        "$reverseArray": "$channels.messages"
                                    },
                                    skip,
                                    amount
                                ]
                            }
                        }
                    }
                ]
            )
        )

        if (result[0].messages.length === 0) {
            return res.status(204).json({ error: "There are no more chat messages in this channel" });
        }

        res.status(200).json(result[0]);

    },
}