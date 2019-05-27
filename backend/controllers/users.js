const JWT = require('jsonwebtoken');
const User = require('../models/user');
const Chatroom = require('../models/chatroom');
const { JWT_S } = require('../config/index');

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
                name: name
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
        const foundUser = await User.findOne({ "local.email": req.user.local.email })


        const token = signToken(req.user);

        res.cookie('access_token', token, {
            httpOnly: true
        });

        res.status(200).json({ username: req.user.local.name });
    },
    chat: async (req, res, next) => {

        const ownedChatroomsId = req.user.local.chatRooms.owned;
        const joinedChatroomsId = req.user.local.chatRooms.joined;

        const ownedChatroomData = await Chatroom.find().where('id').in(ownedChatroomsId);
        const joinedChatroomData = await Chatroom.find().where('id').in(joinedChatroomsId);

        const formattedOwnedData = ownedChatroomData.map(el => {
            return {
                id: el.id,
                name: el.name,
                channels: el.channels
            }
        })

        const formattedJoinedData = joinedChatroomData.map(el => {
            return {
                id: el.id,
                name: el.name,
                channels: el.channels
            }
        })

        res.status(200).json({
            username: req.user.local.name,
            chatRooms: {
                owned: formattedOwnedData,
                joined: formattedJoinedData
            }
        })

    },
    newChat: async (req, res, next) => {

        const id = req.body.id
        const name = req.body.name
        const owner = req.params.username

        console.log(owner);


        const newChatroom = new Chatroom({
            id: id,
            name: name,
            owner: owner,
        })

        await newChatroom.save();

        await User.findOneAndUpdate({ "local.name": owner }, {
            "$push":
            {
                "local.chatRooms.owned": id
            }
        })

        res.status(201).json({ success: "New chat has been created" })
    },
    joinChat: async (req, res, next) => {

        const id = req.body.id;
        const username = req.body.username

        const foundChatroom = await Chatroom.findOne({ "id": id });

        if (!foundChatroom) {
            return res.status(403).json({ error: "Chat doesn't exist" });
        }

        await User.findOneAndUpdate({ "local.name": username }, {
            "$push":
            {
                "local.chatRooms.joined": id
            }
        })

        res.status(200).json({ "success": "Joined chatroom" });
    },
    deleteChat: async (req, res, next) => {

        const id = req.params.id;
        const username = req.params.username

        console.log(username);

        // Check if request is from owner
        const foundOwner = await Chatroom.findOne({ "id": id });

        if (username !== foundOwner.owner) {
            console.log(foundOwner.owner);
            return res.status(403).json({ error: "Unauthorized" })
        }

        // Delete chatroom
        await Chatroom.findOneAndDelete({ "id": id });

        // Find owner and delete it's id
        await User.findOneAndUpdate({ "local.chatRooms.owned": id }, {
            $pull: {
                "local.chatRooms.owned": id
            }
        });

        // Find room clients and delete all id's
        await User.updateMany({ "local.chatRooms.joined": id }, {
            $pull: {
                "local.chatRooms.joined": id
            }
        });

        res.status(200).json({ success: "Chat has been deleted" })
    },
    newChannel: async (req, res, next) => {

        const channelID = req.body.channelID
        const name = req.body.name

        const data = {
            id: channelID,
            name: name
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

        const channels = await Chatroom.findOne({ "id": req.params.id }, { "_id": 0 }).select("channels");

        console.log(channels);

        res.status(200).json(channels)
    },
    storeMessage: async (req, res, next) => {
        const username = req.params.username;
        const id = req.params.id;

        const data = {
            author: username,
            body: req.body.body,
            created_at: req.body.created_at
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
    googleOAuth: async (req, res, next) => {
        const token = signToken(req.user);
        res.status(200).json({ token });
    },
    facebookOAuth: async (req, res, next) => {
        const token = signToken(req.user);
        res.status(200).json({ token });
    }
}