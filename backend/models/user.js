const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    method: {
        type: String,
        enum: ['local', 'google', 'facebook'],
        required: true
    },
    local: {
        email: {
            type: String,
            lowercase: true
        },
        password: {
            type: String,
        }
    },
    google: {
        id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }
    },
    facebook: {
        id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }
    },

});

userSchema.pre('save', async function (next) {
    try {
        if (this.method !== 'local') {
            next();
        }
        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Generate password hash
        const hashedPassword = await bcrypt.hash(this.local.password, salt);

        // Replace originial password with a hashed password
        this.local.password = hashedPassword;

        next();

    } catch (error) {
        next(error);
    }
});

userSchema.methods.isValidPassword = async function (newPassword) {
    try {
        return await bcrypt.compare(newPassword, this.local.password);
    } catch (error) {
        throw new Error(error);
    }
}

const user = mongoose.model('user', userSchema);

module.exports = user;