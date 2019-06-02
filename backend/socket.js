const io = require('./index.js');

io.on("connection", function (socket) {


    socket.on('SEND_MESSAGE', function (data) {
        io.in(data.room).emit('RECEIVE_MESSAGE', data);
    })

    socket.on('LEAVE_ROOM', function () {

        socket.leave(Object.keys(socket.rooms)[1])

        socket.emit('LEFT_ROOM')

    })

    socket.on('CLIENT_IS_TYPING', function (data) {
        console.log(data);
        socket.broadcast.to(data.room).emit('SOMEONE_IS_TYPING');
    })

    socket.on('JOIN_CHANNEL', function (data) {

        socket.username = data.name

        const previousRoom = Object.keys(socket.rooms)[1];

        socket.leave(previousRoom);


        // Update previous room list of connected users
        let previousClients = []
        if (io.sockets.adapter.rooms[previousRoom] === undefined) {
            previousClients = []
        } else previousClients = io.sockets.adapter.rooms[previousRoom].sockets;

        let previousRoomSocketIds = [];

        for (var k in previousClients) previousRoomSocketIds.push(k);

        let previousRoomUsernames = previousRoomSocketIds.map((el, index) => {
            return io.sockets.connected[el].username
        })

        io.in(previousRoom).emit('UPDATING_USERS', previousRoomUsernames);

        socket.join(data.room);

        socket.emit('NEW_ROOM', data);

        // Get room socket IDs 

        if (io.sockets.adapter.rooms[data.room] === undefined) {
            clients = []
        } else clients = io.sockets.adapter.rooms[data.room].sockets;

        // Format data to only have array of sockets
        let roomSocketIds = [];
        for (var k in clients) roomSocketIds.push(k);

        // Map sockets id and find username specified in socket.username
        let usernames = roomSocketIds.map((el, index) => {
            return io.sockets.connected[el].username
        })

        // Send updated list of usernames to room he is connected to
        io.in(data.room).emit('UPDATING_USERS', usernames);

        socket.on('disconnect', () => {

            let clients = [];
            let roomSocketIds = [];

            if (io.sockets.adapter.rooms[data.room] === undefined) {
                clients = []
            } else clients = io.sockets.adapter.rooms[data.room].sockets;

            for (var k in clients) roomSocketIds.push(k);
            let usernames = roomSocketIds.map((el, index) => {
                return io.sockets.connected[el].username
            })
            io.in(data.room).emit('UPDATING_USERS', usernames);

        })
    })
})
