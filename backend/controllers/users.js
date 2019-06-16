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
        const foundUser = await User.findOne({ "email": email })
        const foundName = await User.findOne({ "name": name })

        if (foundUser) {
            return res.status(403).send({ error: "Email arleady in use" })
        }

        if (foundName) {
            return res.status(403).send({ error: "Username arleady in use" })
        }

        // Create new user

        const newUser = new User({
            email: email,
            password: password,
            name: name,
            avatar: 'https://justchattingbucket.s3.eu-west-3.amazonaws.com/DefaultUserAvatar'

        });
        await newUser.save();

        const token = signToken(newUser);

        res.cookie('access_token', token, {
            httpOnly: true
        });

        res.status(200).json({ "success": "User has been registered" });


    },
    signIn: async (req, res, next) => {

        const avatar = req.user.avatar;
        const username = req.user.name;
        const id = req.user._id;
        const token = signToken(req.user);

        res.cookie('access_token', token, {
            httpOnly: true
        });

        res.status(200).json({
            username,
            avatar,
            id
        });
    },
    changePassword: async (req, res, next) => {

        const password = req.body.password
        await User.findOne({ "_id": req.params.id }, function (err, doc) {
            doc.password = password;
            doc.save();
        });

        res.status(200).json({ success: "Password has been changed" })
    },
    changeAvatar: async (req, res, next) => {

        const id = req.params.id

        await User.findOneAndUpdate({ "_id": id }, { "avatar": `https://justchattingbucket.s3.eu-west-3.amazonaws.com/${id}` })

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