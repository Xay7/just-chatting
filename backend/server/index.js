const { app, io } = require("../bin/www")

const express = require("express")
const expressSession = require("express-session")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

const morgan = require("morgan")
const cors = require("cors")

const sessionSecret = require("../config/index").session

const mongoose = require("../bin/database")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan("dev"))

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
)

app.use(
    expressSession({
        secret: sessionSecret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1800000,
            sameSite: "none",
            secure: true,
            httpOnly: true,
        },
    })
)

app.use("/users", require("../routes/users"))
app.use("/chatrooms", require("../routes/chatroom"))
app.use("/channels", require("../routes/channel"))

module.exports = app
