const app = require('./app');
const socket = require("socket.io");

const port = process.env.PORT || 3001;

server = app.listen(port);
io = socket(server);

io.on("connection", (socket) => {
    socket.on('SEND_MESSAGE', function (data) {
        io.emit('RECEIVE_MESSAGE', data);
    })
})



console.log(`Server listening at ${port}`)