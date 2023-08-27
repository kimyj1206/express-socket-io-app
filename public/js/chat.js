const socket = io();

const query = new URLSearchParams(location.search);
// ?username=우사기&room=usagi

const userName = query.get('username');
// 우사기

const room = query.get('room');
// usagi

// client -> server send
socket.emit('join', {userName, room }, (error) => {
  if(error) {
    alert(error);
    location.href = '/';
  }
});

const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  });

  document.querySelector('#sidebar').innerHTML = html;
});