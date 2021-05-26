const express = require("express")
const morgan = require("morgan")
const bodyParser = require("body-parser")
const cors = require("cors")
const mongoose = require("mongoose")
const app = express()
const sessionSecret = require("./config/index").session
const cookieParser = require("cookie-parser")
const socket = require("socket.io")
const expressSession = require("express-session")
const port = process.env.PORT || 3001
require("dotenv").config({ path: __dirname + "/.env" })

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
mongoose.set("useFindAndModify", false)

const server = app.listen(port)
io = socket(server)

module.exports = io

app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
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

app.use("/users", require("./routes/users"))
app.use("/chatrooms", require("./routes/chatroom"))
app.use("/channels", require("./routes/channel"))

console.log(`Listening at ${port}`)
