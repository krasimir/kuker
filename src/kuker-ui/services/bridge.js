/* eslint-disable vars-on-top, no-use-before-define */
import { KUKER_EMITTER_SOCKET_PORT, KUKER_EVENT } from '../constants';
import isInDevTools from '../helpers/isInDevTools';

const socketRetryInterval = 2500;
const listeners = [];
const bridge = {
  on: function (callback) {
    listeners.push(callback);
  }
};
const notify = function (message) {
  listeners.forEach(f => f(message));
};
const wire = function () {
  if (!isInDevTools()) return;

  // receiving events
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    // if (chrome.devtools.inspectedWindow.tabId === readFromPath(sender, 'tab.id')) {
    // console.log('Message arrived: ', message);
    notify(message);
    sendResponse('received');
  });
};
const wireWithSockets = function () {
  var timeoutInterval = null;

  function fail(socket) {
    try {
      if (socket) {
        socket.close();
        socket.disconnect();
      }
    } catch (error) {
      console.log('Error closing the socket', error);
    }
    clearTimeout(timeoutInterval);
    timeoutInterval = setTimeout(init, socketRetryInterval);
  }
  function listen(serverURL, noRetry) {
    const URL = serverURL + ':' + KUKER_EMITTER_SOCKET_PORT;

    console.log('Trying to connect to ' + URL);

    const socket = io(URL, { reconnection: false });
    var messagesToAdd = [];
    var requestAnimationFrameRequest = null;

    socket.on(KUKER_EVENT, function (message) {
      message = message.map(m => { m.serverURL = serverURL; return m; });
      messagesToAdd = messagesToAdd.concat(message);
      cancelAnimationFrame(requestAnimationFrameRequest);
      requestAnimationFrame(function () {
        notify(messagesToAdd);
        messagesToAdd = [];
      });
      socket.emit('received');
    });
    if (!noRetry) {
      socket.on('connect_error', () => fail(socket));
      socket.on('connect_timeout', () => fail(socket));
      socket.on('reconnect_error', () => fail(socket));
      socket.on('reconnect_failed', () => fail(socket));
    }
  }
  function init() {
    console.log('Bridge init');
    if (isInDevTools()) {
      chrome.devtools.inspectedWindow.eval(`;(${ getOrigin.toString() })()`, function (u) {
        if (u) {
          listen(u, false);
        } else {
          fail();
        }
      });
    } else {
      listen('http://localhost', true);
    }
  }

  init();
};

wire();
wireWithSockets();

export default bridge;

// helpers
function getOrigin() {
  if (typeof location !== 'undefined' && location.protocol && location.host) {
    return location.protocol + '//' + location.host;
  }
  return '';
}
