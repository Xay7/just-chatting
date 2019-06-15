const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const cookieParser = require('cookie-parser');
const socket = require("socket.io");
const port = process.env.PORT || 3001;
require('dotenv').config();


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });


const server = app.listen(port);
io = socket(server);

module.exports = io;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
mongoose.set('useFindAndModify', false);


app.use('/users', require('./routes/users'))
app.use('/chatrooms', require('./routes/chatroom'))
app.use('/channels', require('./routes/channel'))

console.log(`Listening at ${port}`);