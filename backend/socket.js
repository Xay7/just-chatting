const io = require('./index.js');

let rooms = {};

io.on('connection', function (socket) {
  socket.on('SEND_MESSAGE', function (data) {
    socket.broadcast.to(data.channel_id).emit('RECEIVE_MESSAGE', data);
  });

  socket.on('USER_LOGGED_IN', function (data) {
    socket.username = data.username;
    socket.chatrooms = data.roomIDs;
    socket.user_id = data.user_id;
    data.roomIDs.map((el) => {
      if (rooms[el] === undefined) {
        rooms[el] = [];
        rooms[el].push({
          id: data.user_id,
          username: data.username,
          avatar: data.avatar,
        });
      } else
        rooms[el].push({
          id: data.user_id,
          username: data.username,
          avatar: data.avatar,
        });
      socket.join(el);
      io.in(el).emit('USER_LOGGED_IN', {
        id: data.user_id,
      });
    });
  });

  socket.on('CHANGE_ROOM', function (data) {
    const onlineUsers = rooms[data.roomID];
    socket.leave(data.previousRoom);
    socket.join(data.roomID);
  });

  socket.on('ROOM_USER_LIST', function (room) {
    const onlineUsers = rooms[room];

    io.in(room).emit('USER_CHANGED_ROOM', onlineUsers);
  });

  socket.on('USER_LEFT', function (data) {
    rooms[data.room_id] = rooms[data.room_id].filter((el) => {
      return el.id !== data.user_id;
    });
    io.in(data.room_id).emit('USER_LEFT_ROOM', data.user_id);
  });

  socket.on('CLIENT_IS_TYPING', function (data) {
    socket.broadcast.to(data.channel).emit('SOMEONE_IS_TYPING');
  });

  socket.on('NEW_ROOM', function (data) {
    socket.chatrooms.push(data.roomID);
    rooms[data.roomID] = [];
    rooms[data.roomID].push({
      id: data.user_id,
      username: data.username,
      avatar: data.avatar,
    });
  });

  socket.on('JOIN_ROOM', function (data) {
    socket.chatrooms.push(data.roomID);
    if (rooms[data.roomID] === undefined) {
      rooms[data.roomID] = [];
    }
    rooms[data.roomID].push({
      id: data.user_id,
      username: data.username,
      avatar: data.avatar,
    });

    io.in(data.roomID).emit('USER_JOINED_ROOM', {
      id: data.user_id,
      name: data.username,
      avatar: data.avatar,
    });
  });

  socket.on('JOIN_CHANNEL', function (data) {
    if (data.previousChannelID) {
      socket.leave(data.previousChannelID);
    }
    socket.join(data.channelID);
  });
  socket.on('LOGOUT', function () {
    if (socket.chatrooms === undefined) {
      return;
    }
    socket.chatrooms.map((el) => {
      rooms[el] = rooms[el].filter((el) => {
        return el.id !== socket.user_id;
      });
      io.in(el).emit('USER_LOGOUT', socket.user_id);
    });
  });
  socket.on('disconnect', function () {
    if (socket.chatrooms === undefined) {
      return;
    }
    socket.chatrooms.map((el) => {
      rooms[el] = rooms[el].filter((el) => {
        return el.id !== socket.user_id;
      });
      io.in(el).emit('USER_LOGOUT', socket.user_id);
    });
  });
});
