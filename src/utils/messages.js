const generateMessage = (userName, text) => {
  return {
    userName: userName,
    text: text,
    createdAt: new Date().getTime()
  }
};

module.exports = {
  generateMessage
}