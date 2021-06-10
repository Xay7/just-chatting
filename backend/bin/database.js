const { join } = require("path")
config = require("../config/index").database

const { Sequelize, DataTypes } = require("sequelize")

require("dotenv").config({
    path: join(__dirname, "../", "/.env"),
})

const sequelize = new Sequelize("sqlite::memory:")
// const sequelize = new Sequelize(process.env.POSTGRES_URI)

module.exports = {
    sequelize,
    DataTypes,
}

//dialect: "mysql",
//         logging: false,
//         host: "mysql.ct8.pl",
//         username: "m16837_gt",
//         password: "&huyHh1nbDsiYmdErkd*",
//         database: "m16837_wf"
