const server = require("../server/index")

const port = process.env.PORT || 3001

// const io = socket(server)
// module.exports = io

server.listen(port, () =>
    console.log(`Server of worker ${process.pid} is listening on port ${port}`)
)
