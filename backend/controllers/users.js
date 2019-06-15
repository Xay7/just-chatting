const JWT = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_S } = require('../config/index');
const upload = require('../services/fileupload');
const uploadAvatar = upload.single('avatar');


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

        const token = signToken(req.user);

        res.cookie('access_token', token, {
            httpOnly: true
        });

        res.status(200).json({
            username: username,
            avatar: avatar,
            userID: req.user.id
        });
    },
    changePassword: async (req, res, next) => {

        const password = req.body.password
        await User.findOne({ "local.name": req.params.username }, function (err, doc) {
            doc.local.password = password;
            doc.save();
        });

        res.status(200).json({ success: "Password has been changed" })
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
    googleOAuth: async (req, res, next) => {
        const token = signToken(req.user);
        res.status(200).json({ token });
    },
    facebookOAuth: async (req, res, next) => {
        const token = signToken(req.user);
        res.status(200).json({ token });
    }
}