const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const channelMessageSchema = new Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    channel_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'channel',
        required: true
    },
    body: {
        type: String,
        required: true,
    },
    created_at: {
        type: String,
        required: true
    }
}).set('toJSON', {
    versionKey: false,
    transform: function (doc, ret) { delete ret._id }
});

const channelMessage = mongoose.model('channelMessage', channelMessageSchema);

module.exports = channelMessage;