// db 대체
const users = [];

const addUser = ({ id, userName, room }) => {
  
  console.log('userName : ' + userName + ' room : ' + room);

  userName = userName.trim();
  room = room.trim();

  // if(!userName || !room) {
  //   return {
  //     error: '사용자 이름과 방이 필요합니다.'
  //   }
  // }

  // // user 중복 검사
  // const existingUser = users.find((user) => {
  //   return user.room === room && user.userName === userName
  // });

  // if(existingUser) {
  //   return {
  //     error: '현재 사용자 이름은 사용 중입니다.'
  //   }
  // };

  // user 저장
  const user = {
    id: id,
    userName: userName,
    room: room
  };
  users.push(user);
  return { user };
};


const getUsersInRoom = (room) => {
  room = room.trim();
  return users.filter((user) => { user.room === room });
};


const getUser = (id) => {
  return users.find((user) => {
    console.log('user' + user);
    user.id === id
  });
};


const removeUser = (id) => {
  const index = users.findIndex((user) => {
    return user.id === id
  });

  if(index !== -1) {
    // 만약 user가 있다면 지우기
    return users.splice(index, 1)[0];
    // [0]은 지워진 user의 정보를 리턴한다는 의미
  }
};


module.exports = {
  addUser,
  getUsersInRoom,
  getUser,
  removeUser
}