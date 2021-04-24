import config from '../config';

let _socket;
let _events = {};

export function connect(user) {
  _socket = io(
    config.environment === 'development'
      ? `ws://${window.location.hostname}:8001`
      : '',
    {
      query: { username: user }
    }
  );

  _socket.onAny((eventName, ...args) => {
    _events[eventName]?.map((cb) => cb(args));
  });
}

/**
 * Register an event listener to the socket.
 *
 * @param {String} event
 * @param {Function} callback
 * @returns {Function} unsubscribe function
 */
export function registerToSocket(event, callback) {
  if (!_events[event]) _events[event] = [];

  _events[event].push(callback);

  // create an "unsubscribe" function
  return () => {
    _events[event]?.splice(
      _events[event].findIndex((cb) => cb === callback),
      1
    );
  };
}

export function sendMessage(message) {
  _socket.emit('message', message, new Date());
}
