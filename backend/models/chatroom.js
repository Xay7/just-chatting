<<<<<<< HEAD
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
=======
module.exports = (sequelize, DataTypes) => {
    const Chatroom = sequelize.define("Chatroom", {
        id: {
            type: DataTypes.INTEGER,
            unique: true,
            primaryKey: true,
            allowNull: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })
    return Chatroom
}
>>>>>>> 73e8593571a2f00b92217314feb92974fefdd528
