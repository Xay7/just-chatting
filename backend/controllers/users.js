const JWT = require('jsonwebtoken');
const User = require('../models/user');
const Chatroom = require('../models/chatroom');
const { JWT_S } = require('../config/index');
const upload = require('../services/fileupload');
const uploadAvatar = upload.single('avatar');
const uuid4 = require('uuid4');


signToken = user => {
    return token = JWT.sign({
        iss: 'HELLO',
        sub: user.id,
        iat: new Date().getTime(), // CURRENT TIME
        exp: new Date().setDate(new Date().getDate() + 1) // TOMMOROW
    }, JWT_S)
}


module.exports = {
    signUp: async (req, res, next) => {
        // Email and password from user
        const { email, password, name } = req.value.body
        // Check if user exists in database
        const foundUser = await User.findOne({ "local.email": email })
        const foundName = await User.findOne({ "local.name": name })

        if (foundUser) {
            return res.status(403).send({ error: "Email arleady in use" })
        }

        if (foundName) {
            return res.status(403).send({ error: "Username arleady in use" })
        }

        // Create new user

        const newUser = new User({
            method: 'local',
            local: {
                email: email,
                password: password,
                name: name,
                avatar: 'https://justchattingbucket.s3.eu-west-3.amazonaws.com/DefaultUserAvatar'
            }
        });
        await newUser.save();

        const token = signToken(newUser);

        res.cookie('access_token', token, {
            httpOnly: true
        });

        res.status(200).json({ "success": "User has been registered" });


    },
    signIn: async (req, res, next) => {

        let avatar = req.user.local.avatar;

        let username = req.user.local.name;

        if (req.user.local.avatar === undefined) {
            avatar = ''
        }

        const token = signToken(req.user);

        res.cookie('access_token', token, {
            httpOnly: true
        });

        res.status(200).json({
            username: username,
            avatar: avatar
        });
    },
    chat: async (req, res, next) => {

        const chatrooms = req.user.local.chatRooms

        const foundChatrooms = await Chatroom.find().where('id').in(chatrooms);

        const formattedChatrooms = foundChatrooms.map(el => {
            return {
                id: el.id,
                name: el.name,
                channels: el.channels,
                owner: el.owner
            }
        })

        res.status(200).json({
            username: req.user.local.name,
            chatRooms: formattedChatrooms
        })

    },
    newChat: async (req, res, next) => {

        const id = req.body.id
        const name = req.body.name
        const owner = req.params.username


        const newChatroom = new Chatroom({
            id: id,
            name: name,
            owner: owner,
            subscribers: {
                subscriber: owner,
                joined_at: new Date(),
            },
            channels: {
                id: uuid4(),
                name: "General"
            }

        })

        await newChatroom.save();

        await User.findOneAndUpdate({ "local.name": owner }, {
            "$push":
            {
                "local.chatRooms": id
            }
        })

        res.status(201).json({ success: "New chat has been created" })
    },
    joinChat: async (req, res, next) => {

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
                "subscribers": {
                    subscriber: username,
                    joined_at: new Date(),
                }
            }
        })

        res.status(200).json({ "success": "Joined chatroom" });
    },
    deleteChat: async (req, res, next) => {

        const id = req.params.id;
        const username = req.params.username

        // Check if request is from owner
        const foundOwner = await Chatroom.findOne({ "id": id });

        if (username !== foundOwner.owner) {
            return res.status(403).json({ error: "Unauthorized" })
        }

        // Delete chatroom
        await Chatroom.findOneAndDelete({ "id": id });

        // Find room clients and delete all id's
        await User.updateMany({ "local.chatRooms": id }, {
            $pull: {
                "local.chatRooms": id
            }
        });

        res.status(200).json({ success: "Chat has been deleted" })
    },
    getChatData: async (req, res, next) => {

        const roomID = req.params.id;

        let formattedData = null;

        await Chatroom.find({ "id": roomID }, { "_id": 0 }).lean().select("channels subscribers -_id owner").exec(async function (err, doc) {

            const subscribers = doc[0].subscribers.map(el => {
                return el.subscriber;
            })

            const foundAvatars = await User.find().where("local.name").in(subscribers).select('local.avatar -_id');

            const foundOwner = await User.findOne({ "local.name": doc[0].owner });

            for (let i = 0; i < foundAvatars.length; i++) {
                doc[0].subscribers[i].avatar = foundAvatars[i].local.avatar;
            }

            formattedData = {
                channels: doc[0].channels,
                subscribers: doc[0].subscribers,
                owner: foundOwner.local.name
            }
            res.status(200).json(formattedData);
        });

    },
    newChannel: async (req, res, next) => {

        const channelID = req.body.channelID
        const name = req.body.name
        const description = req.body.description

        const data = {
            id: channelID,
            name: name,
            description: description
        }

        await Chatroom.findOneAndUpdate({ "id": req.params.id }, {
            "$push":
            {
                "channels": data
            }
        });



        res.status(200).json({ success: "Created new channel" });
    },
    getChannels: async (req, res, next) => {

        const channels = await Chatroom.findOne({ "id": req.params.id }, { "_id": 0 }).select("channels")

        console.log(channels);


        res.status(200).json(channels)
    },
    getChannel: async (req, res, next) => {

        const channel = "xd";

        res.status(200).json(channel);
    },
    changeChannelData: async (req, res, next) => {

        const roomID = req.body.room;
        const channelID = req.body.channel;

        let newChannelName = req.body.channelName;
        const newChannelDescription = req.body.channelDescription

        if (newChannelName == '') {
            newChannelName = req.body.oldChannelName;
        }

        await Chatroom.findOneAndUpdate({ "id": roomID, "channels.id": channelID },
            {
                $set: {
                    "channels.$.name": newChannelName,
                    "channels.$.description": newChannelDescription
                }
            },
            { new: true }
        ).exec(function (error, post) {
            if (error) {
                return res.status(400).send({ error: 'Update failed' });
            }

            return res.status(200).send({ success: "Channel has been updated" });
        });
    },
    deleteChannel: async (req, res, next) => {

        const roomID = req.params.id;
        const channelID = req.params.channelID;

        await Chatroom.updateOne({ "id": roomID }, {
            "$pull": { "channels": { "id": channelID } }
        })

        res.status(200).json({ success: "Channel has been deleted" })
    },
    storeMessage: async (req, res, next) => {
        const username = req.params.username;
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


        await Chatroom.findOne({ "id": id }).lean().exec(function (err, docs) {

            let channel = docs.channels.filter(el => {
                if (el.id === channelID) {
                    return el;
                }
            })
            res.status(200).json(channel);
        });

    },
    changeAvatar: async (req, res, next) => {

        const username = req.params.username

        await User.findOneAndUpdate({ "local.name": username }, { "local.avatar": `https://justchattingbucket.s3.eu-west-3.amazonaws.com/${username}` })

        await uploadAvatar(req, res, function (err) {
            if (err) {
                return res.status(403).json({ error: err.message });
            }

            res.status(201).json({ success: "Updated avatar" });
        })
    },
    changePassword: async (req, res, next) => {

        const password = req.body.password
        await User.findOne({ "local.name": req.params.username }, function (err, doc) {
            doc.local.password = password;
            doc.save();
        });

        res.status(200).json({ success: "Password has been changed" })
    },
    googleOAuth: async (req, res, next) => {
        const token = signToken(req.user);
        res.status(200).json({ token });
    },
    facebookOAuth: async (req, res, next) => {
        const token = signToken(req.user);
        res.status(200).json({ token });
    }
}