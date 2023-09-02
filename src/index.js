const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const { addUser, getUsersInRoom, getUser, removeUser } = require('./utils/users');
const { generateMessage } = require('./utils/messages');

const server = http.createServer(app);
const io = new Server(server);
const port = 3000;

// connection 실행됐을 때 callback function 실행
io.on('connection', (socket) => {
  console.log('socket ID : ' + socket.id);

  // 클라이언트의 데이터를 받아옴
  socket.on('join', (options, callback) => {

    const { error, user } = addUser({ id: socket.id, ...options});

    if(error) {
      return callback(error); // chat.js error handling
    }

    socket.join(user.room);

    // 나 자신에게 보냄
    socket.emit('message', generateMessage('Admin', `${user.room} 방에 오신 걸 환영합니다.`));

    // 나를 제외하고 방에 있는 모든 사람에게 보냄
    socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.userName} 님이 방에 참여했습니다.`));
    
    // 해당 방에 있는 모든 사람에게 보냄
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room)
    })
  });

  // 채팅방에서 메시지를 보냈을 때 실행
  socket.on('sendMessage', (message, callback) => {

    const user = getUser(socket.id);

    // 방에 있는 모든 사람들에게 보냄
    io.to(user.room).emit('message', generateMessage(user.userName, message));
    
    // chat.js의 sendMessage 부분 함수 호출
    callback();
  });

  // 채팅방에서 유저가 방을 나갔을 때 실행
  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('message', generateMessage('Admin', `${user.userName}가 방을 나갔습니다.`));
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
      })
    };

  });

});

// static file path config
const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(path.join(publicDirectoryPath)));

server.listen(port, () => {
  console.log(`succesfully started server at ${port}`);
});