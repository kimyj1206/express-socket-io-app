const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const { addUser, getUsersInRoom } = require('./utils/users');
const { generateMessage } = require('./utils/messages');

// connection 실행됐을 때 callback function 실행
io.on('connection', (socket) => {
  console.log('socket ID : ' + socket.id);

  // client -> server data received
  socket.on('join', (options, callback) => {
    console.log('options : ' + options + ' callback : ' + callback);

    const { error, user } = addUser({ id: socket.id, ...options});

    if(error) {
      return callback(error); // chat.js error handling
    }

    socket.join(user.room);

    // 나 자신에게 보냄
    socket.emit('message', generateMessage('Admin', `${user.room} 방에 오신 걸 환영합니다.`));

    // 나를 제외하고 방에 있는 모든 사람에게 보냄
    socket.broadcast.to(user.room).emit('message', generateMessage('', `${user.userName} 님이 방에 참여했습니다.`));
    
    // 해당 방에 있는 모든 사람에게 보냄
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room)
    })
  });

  socket.on('sendMessage', () => {});
  socket.on('disconnect', () => {});
});

// static file path config
const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(path.join(publicDirectoryPath)));

server.listen(port, () => {
  console.log(`succesfully started server at ${port}`);
});