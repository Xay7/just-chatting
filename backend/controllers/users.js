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
        res.status(200).json({ token: token });


    },
    signIn: async (req, res, next) => {

        const { email } = req.value.body
        const foundUser = await User.findOne({ "local.email": email })
        const token = signToken(req.user);
        res.status(200).json({ token, name: foundUser.local.name, users: io.users });
    },
    chat: async (req, res, next) => {

        const name = req.user.local.name

        const findUser = await User.findOne({ "local.name": name })
        const ownedChatroomsId = findUser.local.chatRooms.owned;
        const joinedChatroomsId = findUser.local.chatRooms.joined;

        const ownedChatroomData = await Chatroom.find().where('id').in(ownedChatroomsId);
        const joinedChatroomData = await Chatroom.find().where('id').in(joinedChatroomsId);

        const formattedOwnedData = ownedChatroomData.map(el => {
            return {
                id: el.id,
                name: el.name
            }
        })

        const formattedJoinedData = joinedChatroomData.map(el => {
            return {
                id: el.id,
                name: el.name
            }
        })

        res.status(200).json({
            username: findUser.local.name,
            chatRooms: {
                owned: formattedOwnedData,
                joined: formattedJoinedData
            }
        })

    },
    newChat: async (req, res, next) => {


        const id = req.body.id
        const name = req.body.name
        const owner = req.body.owner


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
        const name = req.body.name

        const foundChatroom = await Chatroom.findOne({ "id": id });

        if (!foundChatroom) {
            return res.status(403).json({ error: "Chat doesn't exist" });
        }

        await User.findOneAndUpdate({ "local.name": name }, {
            "$push":
            {
                "local.chatRooms.joined": id
            }
        })


        let chatRoomData = {
            id: foundChatroom.id,
            name: foundChatroom.name
        }

        res.status(200).json(chatRoomData);
    },
    deleteChat: async (req, res, next) => {

        const id = req.body.id;

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
    googleOAuth: async (req, res, next) => {
        const token = signToken(req.user);
        res.status(200).json({ token });
    },
    facebookOAuth: async (req, res, next) => {
        const token = signToken(req.user);
        res.status(200).json({ token });
    }
}