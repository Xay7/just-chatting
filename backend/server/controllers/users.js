const JWT = require('jsonwebtoken');
const User = require('../models/user');
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
        const { email, password } = req.value.body
        // Check if user exists in database
        const foundUser = await User.findOne({ email })

        if (foundUser) {
            return res.status(403).send({ error: "Email arleady exists" })
        }

        // Create new user

        const newUser = new User({ email, password });
        await newUser.save();

        const token = signToken(newUser);

        res.status(200).json({ token: token });

    },
    signIn: async (req, res, next) => {

        const token = signToken(req.user);
        res.status(200).json({ token });
        console.log("Successful login");
    },
    chat: async (req, res, next) => {
        console.log("Success");
    }
}