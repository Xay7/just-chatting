const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());

// Routes

app.use('/users', require('./routes/users'))

app.listen(port, () =>
    console.log(`Listening on port ${port}`)
)
