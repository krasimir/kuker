import { KUKER_EMITTER_SOCKET_PORT, KUKER_EVENT } from '../constants';
import isInDevTools from '../helpers/isInDevTools';

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
    notify(message);
    sendResponse('received');
  });
};
const wireWithSockets = function () {
  function listen(serverURL) {
    const URL = serverURL + ':' + KUKER_EMITTER_SOCKET_PORT;
    const socket = io(URL);
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
  }

  if (isInDevTools()) {
    sendMessageToCurrentTag({ type: 'get-page-url' }, listen);
  } else {
    listen('http://localhost');
  }
};

wire();
wireWithSockets();

export default bridge;
