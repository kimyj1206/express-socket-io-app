// db 대체
const users = [];

const addUser = ({ id, userName, room }) => {
  userName = userName.trim();
  room = room.trim();

  if(!userName || !room) {
    return {
      error: '사용자 이름과 방이 필요합니다.'
    }
  }

  // user 중복 검사
  const existingUser = users.find((user) => {
    return user.room === room && user.userName === userName
  });

  if(existingUser) {
    return {
      error: '현재 사용자 이름은 사용 중입니다.'
    }
  };

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

  return users.filter((user) => {
    user.room === room
  });
}

module.exports = {
  addUser,
  getUsersInRoom
}