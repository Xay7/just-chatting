const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    messages: [
        {
            author: String,
            body: String,
            created_at: Date,
            _id: false
        }
    ]

})

const chatroom = mongoose.model('chatroom', chatSchema);

module.exports = chatroom;