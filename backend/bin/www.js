const express = require("express")
const app = express()
const socket = require("socket.io")

const port = process.env.PORT || 3001

const server = app.listen(port, () =>
    console.log(`Server of worker ${process.pid} is listening on port ${port}`)
)

const io = socket(server)

module.exports = {
    app,
    io,
}

require("../server/index")
