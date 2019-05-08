const User = require('../models/user');

module.exports = {
    signUp: async (req, res, next) => {
        // Email and password from user
        console.log('signUP CONTROLLER CALLED');

        const { email, password } = req.value.body

        const newUser = new User({
            email: email,
            password: password
        });

        await newUser.save();

        res.json({ user: 'created' });

    },
    signIn: async (req, res, next) => {
        // Generate Token
        console.log('signIN CONTROLLER CALLED');
    }
}