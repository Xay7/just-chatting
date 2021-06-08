const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }],
}).set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const chatroom = mongoose.model('chatroom', chatSchema);

module.exports = chatroom;
