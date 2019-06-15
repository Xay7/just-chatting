const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true
    },
    members: [
        {
            _id: false,
            member: String,
            role: String,
            joined_at: String
        }
    ]
}).set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id }
});

const chatroom = mongoose.model('chatroom', chatSchema);

module.exports = chatroom;