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
const getActiveTabId = function (callback) {
  try {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (!tabs || tabs.length === 0) {
        callback(); return;
      }
      callback(tabs[0].id);
    });
  } catch (error) {
    console.log(error);
    callback();
  }
};
const sendMessageToCurrentTag = function (data, callback) {
  getActiveTabId(function (id) {
    if (!id) {
      console.error('It can\'t get the current active tab.');
    }
    chrome.tabs.sendMessage(id, data, callback);
  });
};
const activeTabConsoleLog = function (...data) {
  sendMessageToCurrentTag({ type: 'console.log', data });
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
  function fail(socket) {
    try {
      socket.close();
      socket.disconnect();
    } catch (error) {
      console.log('Error closing the socket', error);
    }
    setTimeout(init, socketRetryInterval);
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
    if (isInDevTools()) {
      sendMessageToCurrentTag({ type: 'get-page-url' }, u => listen(u, false));
    } else {
      listen('http://localhost', true);
    }
  }

  init();
};

wire();
wireWithSockets();

export default bridge;
