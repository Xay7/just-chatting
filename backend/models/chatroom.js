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
    }

})

const chatroom = mongoose.model('chatroom', chatSchema);

module.exports = chatroom;