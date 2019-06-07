const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true
    },
    subscribers: [
        {
            subscriber: String,
            joined_at: String
        }
    ],
    channels: [
        {
            _id: false,
            id: {
                type: String
            },
            name: {
                type: String
            },
            description: {
                type: String
            },
            messages: [
                {
                    author: String,
                    body: String,
                    created_at: Date,
                    _id: false,
                    avatar: String
                }
            ]
        }
    ]

})

const chatroom = mongoose.model('chatroom', chatSchema);

module.exports = chatroom;