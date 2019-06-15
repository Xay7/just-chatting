const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const channelSchema = new Schema({
    chatroom_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
}).set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id }
});



const channel = mongoose.model('channel', channelSchema);

module.exports = channel;