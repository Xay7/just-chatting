const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'channel',
            required: true
        }
    ]
}).set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id }
});

const conversation = mongoose.model('conversation', conversationSchema);

module.exports = conversation;