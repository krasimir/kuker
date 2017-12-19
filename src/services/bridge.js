import { KUKER_EMITTER_SOCKET_PORT, KUKER_EVENT } from '../constants';

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
  if (!chrome || !chrome.runtime || !chrome.runtime.onMessage) return;

  // receiving events
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    // if (chrome.devtools.inspectedWindow.tabId === readFromPath(sender, 'tab.id')) {
    notify(message);
    sendResponse('received');
  });
};
const wireWithSockets = function () {
  const URL = `http://localhost:${ KUKER_EMITTER_SOCKET_PORT }`;
  const socket = io(URL);

  socket.on(KUKER_EVENT, function (message) {
    notify(message);
    socket.emit('received');
  });
};

wire();
wireWithSockets();

export default bridge;
