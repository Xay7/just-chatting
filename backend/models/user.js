const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        lowercase: true
    },
    password: {
        type: String,
    },
    avatar: {
        type: String,
    },
    chatrooms: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'chatroom', required: true }
    ]
}).set('toJSON', {
    versionKey: false,
});


userSchema.pre('save', async function (next) {
    try {

        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Generate password hash
        const hashedPassword = await bcrypt.hash(this.password, salt);

        // Replace originial password with a hashed password
        this.password = hashedPassword;

        next();

    } catch (error) {
        next(error);
    }
});

userSchema.methods.isValidPassword = async function (newPassword) {
    try {
        return await bcrypt.compare(newPassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
}

const user = mongoose.model('user', userSchema);

module.exports = user;