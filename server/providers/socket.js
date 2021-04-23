const {
  getAnswerForQuestion,
  loadChatHistory,
  sendMessage
} = require('./elasticsearch');
const { Server } = require('socket.io');

/**@type {Server} */
let _io;

const _clients = {};

function initSocketServer(httpServer) {
  _io = new Server(httpServer);

  _io.on('connection', async (socket) => {
    const { username } = socket.handshake.query;

    if (!username) {
      socket.disconnect(true);
      return;
    }

    _clients[socket.id] = username;

    // Send the chat history over to the client
    socket.emit('getHistory', await loadChatHistory());
    _io.emit('onlineUsers', Object.values(_clients));

    socket.on('disconnect', () => {
      delete _clients[socket.id];
      _io.emit('onlineUsers', Object.values(_clients));
    });

    socket.on('message', async (content, timestamp) => {
      sendMessage(_clients[socket.id], content, timestamp);
      socket.broadcast.emit('message', _clients[socket.id], content, timestamp);

      // Bot functionality
      if (content.includes('?')) {
        const possibleAnswer = await getAnswerForQuestion(content);

        if (possibleAnswer) {
          _io.emit(
            'message',
            'cleverBot',
            possibleAnswer.content,
            possibleAnswer.timestamp
          );
        }
      }
    });
  });
}

module.exports = { initSocketServer };
