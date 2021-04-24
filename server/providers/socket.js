const {
  getAnswerForQuestion,
  loadChatHistory,
  sendMessage
} = require('./elasticsearch');
const { Server } = require('socket.io');
const { cleverify } = require('./utility');

/**@type {Server} */
let _io;

const _clients = {};

function initSocketServer(httpServer) {
  _io = new Server(httpServer, {
    cors: {
      origin: true,
      methods: ['GET', 'POST', 'PUT']
    }
  });

  _io.on('connection', async (socket) => {
    const { username } = socket.handshake.query;

    if (!username) {
      socket.disconnect(true);
      return;
    }

    _clients[socket.id] = username;
    console.log(
      `User ${username} has joined! Users: ${Object.values(_clients)}`
    );

    // Send the chat history over to the client
    const messages = await loadChatHistory();
    socket.emit('getHistory', { messages });
    _io.emit('onlineUsers', { users: Object.values(_clients) });

    socket.on('disconnect', () => {
      const user = _clients[socket.id];

      delete _clients[socket.id];

      console.log(
        `User ${user} disconnected. Users: ${Object.values(_clients)}`
      );
      _io.emit('onlineUsers', { users: Object.values(_clients) });
    });

    socket.on('message', async (content, timestamp) => {
      sendMessage(_clients[socket.id], content, timestamp);
      _io.emit('message', _clients[socket.id], content, timestamp);

      // Bot functionality
      if (content.includes('?')) {
        const possibleAnswer = await getAnswerForQuestion(content);

        if (possibleAnswer) {
          const botMessage = cleverify(possibleAnswer.content);

          await sendMessage('cleverBot', botMessage, Date.now());
          _io.emit('message', 'cleverBot', botMessage, Date.now());
        }
      }
    });
  });
}

module.exports = { initSocketServer };
