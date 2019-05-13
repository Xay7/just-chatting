const io = require('./index.js');


var users = [];

io.on("connection", function (socket) {

    socket.on('SEND_MESSAGE', function (data) {
        io.emit('RECEIVE_MESSAGE', data);
    })

    socket.on('UPDATE_USERS', function (data) {
        socket.name = data.name

        users.push(socket.name);
        io.emit('UPDATING_USERS', users);
    })

    socket.on('disconnect', function () {

        let index = users.indexOf(socket.name)
        if (index => 0) {
            users.splice(index, 1);
        }
        io.emit('UPDATING_USERS', users)
    })
})
