const io = require('./index.js');

let users = {};

io.on("connection", function (socket) {

    socket.on('SEND_MESSAGE', function (data) {
        console.log(data.room);
        io.in(data.room).emit('RECEIVE_MESSAGE', data);
    })

    socket.on('USER_LOGGED_IN', function (data) {

        socket.username = data.username;
        socket.chatrooms = data.roomIDs;
        socket.user_id = data.user_id

        data.roomIDs.map(el => {

            if (users[el] === undefined) {
                users[el] = [];
                users[el].push({
                    id: data.user_id,
                    username: data.username,
                    avatar: data.avatar
                });
            } else users[el].push({
                id: data.user_id,
                username: data.username,
                avatar: data.avatar
            });

            io.in(el).emit("USER_LOGGED_IN", {
                id: data.user_id,
                username: data.username,
                avatar: data.avatar
            });

        })

    })

    socket.on('CHANGE_ROOM', function (data) {

        const usernames = users[data.roomID];
        socket.leave(data.previousRoom)
        socket.join(data.roomID);

        io.in(data.roomID).emit('ROOM_USER_LIST', usernames);

    });

    socket.on('USER_LEFT', function (data) {
        socket.leave(data.room_id);
        users[data.room_id] = users[data.room_id].filter(el => {
            return el.id !== data.user_id
        })
        io.in(data.room_id).emit('USER_LEFT_ROOM', data.user_id);
    })

    socket.on('CLIENT_IS_TYPING', function (data) {
        socket.broadcast.to(data.channel).emit('SOMEONE_IS_TYPING');
    })

    socket.on('NEW_ROOM', function (data) {
        socket.chatrooms.push(data.roomID)
        users[data.roomID] = [];
        users[data.roomID].push({
            id: data.user_id,
            username: data.username,
            avatar: data.avatar
        });
    })

    socket.on('JOIN_ROOM', function (data) {
        socket.chatrooms.push(data.roomID)
        if (users[data.roomID] === undefined) {
            users[data.roomID] = []
        }
        users[data.roomID].push({
            id: data.user_id,
            username: data.username,
            avatar: data.avatar
        });

        io.in(data.roomID).emit('USER_JOINED_ROOM', {
            id: data.user_id,
            name: data.username,
            avatar: data.avatar
        });
    })

    socket.on('JOIN_CHANNEL', function (data) {

        if (data.previousChannelID) {
            socket.leave(data.previousChannelID)
        }

        socket.join(data.channelID);

        socket.emit('UPDATING_MESSAGES', data);

    })
    socket.on('disconnect', function () {
        if (socket.chatrooms === undefined) {
            return;
        }
        socket.chatrooms.map(el => {
            users[el] = users[el].filter(el => {
                return el.id !== socket.user_id
            })
            io.in(el).emit('USER_DISCONNECTED', socket.user_id);
        })
    })
})
