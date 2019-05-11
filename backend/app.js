const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const socket = require("socket.io");
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });


app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());




app.use('/users', require('./routes/users'))




module.exports = app;