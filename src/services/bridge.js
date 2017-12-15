import readFromPath from '../helpers/readFromPath';

const HEALTHY_CHECK_INTERVAL = 4000;
const listeners = [];
const bridge = {
  on: function (callback) {
    listeners.push(callback);
  }
};
const notify = function (message) {
  listeners.forEach(f => f(message));
};
const sendMessageToCurrentTag = function (data, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (!tabs || tabs.length === 0) {
      callback(); return;
    }
    chrome.tabs.sendMessage(tabs[0].id, data, callback);
  });
};
const wire = () => {
  if (!chrome || !chrome.runtime || !chrome.runtime.onMessage) return;

  // receiving events
  chrome.runtime.onMessage.addListener(function (message, sender) {
    if (readFromPath(chrome, 'devtools.inspectedWindow.tabId') === readFromPath(sender, 'tab.id')) {
      notify(message);
    }
  });

  (function healthyCheck() {
    sendMessageToCurrentTag({ isHealthy: true }, response => {
      if (response && response.healthy === true) {
        notify([{ healthy: { status: true } }]);
      } else {
        notify([{ healthy: { status: false } }]);
      }
      setTimeout(healthyCheck, HEALTHY_CHECK_INTERVAL);
    });
  })();
};

wire();

export default bridge;
