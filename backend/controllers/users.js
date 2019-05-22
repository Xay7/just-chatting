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

        const userChatRoomsIds = findUser.local.chatRooms;

        let userChatRoomsNames = [];

        await Chatroom.find().where('id').in(userChatRoomsIds).exec(function (err, record) {
            console.log(record);
            userChatRoomsNames = record.map(el => {
                console.log(el.name);
                return el.name
            })


            var combined = []
            for (var i = 0; i < userChatRoomsIds.length; i++) {
                combined[i] = {
                    id: userChatRoomsIds[i],
                    name: userChatRoomsNames[i],
                }
            }

            res.status(200).json({
                username: findUser.local.name,
                chatRooms: combined
            });
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

        const foundChatroom = await Chatroom.findOne({ "name": name });

        // if (foundChatroom) {
        //     return res.status(403).send({ error: "Chatroom name arleady in use" });
        // }

        await newChatroom.save();

        await User.findOneAndUpdate({ "local.name": owner }, {
            "$push":
            {
                "local.chatRooms": id
            }
        })

        res.status(200).json({ success: "New chat has been created" })
    },
    deleteChat: async (req, res, next) => {
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