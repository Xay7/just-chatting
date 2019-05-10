const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());

// Routes

app.use('/users', require('./routes/users'))


module.exports = app;