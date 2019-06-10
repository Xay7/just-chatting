const io = require('./index.js');

io.on("connection", function (socket) {


    socket.on('SEND_MESSAGE', function (data) {
        io.in(data.room).emit('RECEIVE_MESSAGE', data);
    })

    socket.on('USER_LOGGED_IN', function () {
        console.log("xd");
    })

    socket.on('CHANGE_ROOM', function (data) {

        socket.username = data.username
        socket.avatar = data.avatar

        socket.leave(Object.keys(socket.rooms)[1]);
        socket.leave(Object.keys(socket.rooms)[2]);

        const previousRoom = Object.keys(socket.rooms)[1];

        let previousClients = []
        if (io.sockets.adapter.rooms[previousRoom] === undefined) {
            previousClients = []
        } else previousClients = io.sockets.adapter.rooms[previousRoom].sockets;


        let previousRoomSocketIDs = [];

        for (var k in previousClients) previousRoomSocketIDs.push(k);

        let previousRoomUsernames = previousRoomSocketIDs.map((el, index) => {
            return {
                username: io.sockets.connected[el].username,
                avatar: io.sockets.connected[el].avatar
            }
        })

        console.log(previousRoomUsernames);

        io.in(previousRoom).emit('UPDATING_USERS', previousRoomUsernames);

        socket.join(data.roomID);

        let clients = []

        if (io.sockets.adapter.rooms[data.roomID] === undefined) {
            clients = []
        } else clients = io.sockets.adapter.rooms[data.roomID].sockets;

        // Format data to only have array of sockets
        let roomSocketIDs = [];
        for (var k in clients) roomSocketIDs.push(k);

        // Map sockets id and find username specified in socket.username
        let usernames = roomSocketIDs.map((el, index) => {
            return {
                username: io.sockets.connected[el].username,
                avatar: io.sockets.connected[el].avatar
            }
        })

        // Send updated list of usernames to room he is connected to
        io.in(data.roomID).emit('UPDATING_USERS', usernames);

        socket.on('disconnect', () => {

            let clients = [];
            let roomSocketIDs = [];

            if (io.sockets.adapter.rooms[data.roomID] === undefined) {
                clients = []
            } else clients = io.sockets.adapter.rooms[data.roomID].sockets;

            for (var k in clients) roomSocketIDs.push(k);
            let usernames = roomSocketIDs.map((el, index) => {
                return io.sockets.connected[el].username
            })
            io.in(data.roomID).emit('UPDATING_USERS', usernames);

        })

    })

    socket.on('CLIENT_IS_TYPING', function (data) {
        socket.broadcast.to(data.channel).emit('SOMEONE_IS_TYPING');
    })

    socket.on('JOIN_CHANNEL', function (data) {

        const previousRoom = Object.keys(socket.rooms)[2];

        socket.leave(previousRoom);

        socket.join(data.room);

        socket.emit('UPDATING_MESSAGES', data);

    })
    socket.on('OWNER_DELETED_ROOM', function (data) {
        io.in(data.room).emit('ROOM_DELETED');
    })
})
