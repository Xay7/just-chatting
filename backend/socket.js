const io = require('./index.js');

let users = {};

io.on("connection", function (socket) {

    socket.on('SEND_MESSAGE', function (data) {
        io.in(data.room).emit('RECEIVE_MESSAGE', data);
    })

    socket.on('USER_LOGGED_IN', function (data) {

        socket.username = data.username;
        socket.roomIDs = data.roomIDs

        data.roomIDs.map(el => {

            io.in(el).emit("USER_LOGGED_IN", {
                username: data.username,
                avatar: data.avatar
            });

            socket.join(el);

            if (users[el] === undefined) {
                users[el] = [];
                users[el].push({
                    username: data.username,
                    avatar: data.avatar
                });
            } else users[el].push({
                username: data.username,
                avatar: data.avatar
            });

        })

    })

    socket.on('CHANGE_ROOM', function (data) {

        const usernames = users[data.roomID];
        io.in(data.roomID).emit('ROOM_USER_LIST', usernames);

    })

    socket.on('CLIENT_IS_TYPING', function (data) {
        socket.broadcast.to(data.channel).emit('SOMEONE_IS_TYPING');
    })

    socket.on('JOIN_CHANNEL', function (data) {

        if (data.previousChannelID) {
            socket.leave(data.previousChannelID);
        }

        socket.join(data.channelID);

        socket.emit('UPDATING_MESSAGES', data);

    })
    socket.on('OWNER_DELETED_ROOM', function (data) {
        io.in(data.room).emit('ROOM_DELETED');
    })

    socket.on('disconnect', function () {
        socket.roomIDs.map(el => {
            users[el] = users[el].filter(el => {
                return el.username !== socket.username
            })
            io.in(el).emit('USER_DISCONNECTED', socket.username);
        })
    })
})
