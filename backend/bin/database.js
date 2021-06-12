const { join } = require("path")
config = require("../config/index").database
const { host, username, password, database } = config

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
