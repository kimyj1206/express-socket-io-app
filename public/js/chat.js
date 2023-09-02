const socket = io();

const query = new URLSearchParams(location.search);
// ?userName=우사기&room=usagi

const userName = query.get('userName');

const room = query.get('room');

console.log('#### query : ' + query);
console.log('#### userName : ' + userName);
console.log('#### room : ' + room);

// server로 데이터를 보냄
socket.emit('join', { userName, room }, (error) => {
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


const messages = document.querySelector('#messages');
const messageTemplate = document.querySelector('#message-template').innerHTML;

socket.on('message', (message) => {

    const html = Mustache.render(messageTemplate, {
        userName: message.userName,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    });

    // message가 위로 쌓이게 함.
    messages.insertAdjacentHTML('beforeend', html);
    scrollToBottom();
});

function scrollToBottom() {
    messages.scrollTop = messages.scrollHeight;
};


const messageForm = document.querySelector('#message-form');
const messageFormInput = document.querySelector('input');
const messageFormButton = document.querySelector('button');

messageForm.addEventListener('submit', (e) => {

  // event instance를 받아와서 페이지가 refresh 되는 것을 방지함.
  e.preventDefault();

  // message를 보내고 잘 도착하기 전까지 전송 버튼을 누르지 못하게 막음.
  messageFormButton.setAttribute('disabled', 'disabled');

  // input 요소에 입력하는 메시지를 의미함.
  const message = e.target.elements.message.value;

  socket.emit('sendMessage', message, (error) => {
    
    // button 누를 수 있게 해줌.
    messageFormButton.removeAttribute('disabled');
    
    // input 요소 빈 칸으로 비워줌.
    messageFormInput.value = '';
    
    messageFormInput.focus();

    if(error) {
      return console.log(error);
    }

  })

});