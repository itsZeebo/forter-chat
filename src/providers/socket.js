import { io } from 'socket.io-client';
import config from '../config';

let _socket;

export function connect(user) {
  _socket = io(
    config.environment === 'development' ? 'wss://localhost:8001' : '',
    {
      query: { username: user }
    }
  );
}

/**
 * Register an event listener to the socket.
 *
 * @param {String} event
 * @param {Function} callback
 * @returns {Function} unsubscribe function
 */
export function registerToSocket(event, callback) {
  _socket.on(event, callback);
  return () => _socket.off(event, callback);
}

export function sendMessage(message) {
  _socket.emit('message', message, new Date());
}
