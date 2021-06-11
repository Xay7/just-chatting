const { app, io } = require("../bin/www")
const { join } = require("path")
const morgan = require("morgan")
const passport = require("passport")
const session = require("express-session")
const { json, urlencoded } = require("body-parser")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const { sequelize, DataTypes } = require("../bin/database")

require("../models/index")(sequelize, DataTypes)
require("../controllers/passport")(passport, sequelize)

const sessionSecret = require("../config/index").session
const SequelizeStore = require("connect-session-sequelize")(session.Store)

const mainRouter = require("./routers/")

app.use(json())

app.use(urlencoded({ extended: true }))

app.use(cookieParser())

app.use(
    session({
        secret: sessionSecret,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 600000000,
        },
        // store: new SequelizeStore({
        //     db: sequelize,
        // }),
    })
)

app.use(passport.initialize())
app.use(passport.session())

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
)

app.use(morgan("dev"))

app.use("/", mainRouter(passport, sequelize, DataTypes))

module.exports = app
