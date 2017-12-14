import readFromPath from '../helpers/readFromPath';

const HEALTHY_CHECK_INTERVAL = 4000;
const listeners = [];
const bridge = {
  on: function (callback) {
    listeners.push(callback);
  }
};
const notify = message => listeners.forEach(f => f(message));
const healthyCheck = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (!tabs || tabs.length === 0) {
      setTimeout(healthyCheck, HEALTHY_CHECK_INTERVAL);
      return;
    }
    chrome.tabs.sendMessage(tabs[0].id, { healthyCheck: true }, function (response) {
      if (response && response.healthy === true) {
        notify([{ healthy: { status: true } }]);
      } else {
        notify([{ healthy: { status: false } }]);
      }
      setTimeout(healthyCheck, HEALTHY_CHECK_INTERVAL);
    });
  });
};
const wire = () => {
  if (!chrome || !chrome.runtime || !chrome.runtime.onMessage) return;

  chrome.runtime.onMessage.addListener(function (message, sender) {
    if (readFromPath(chrome, 'devtools.inspectedWindow.tabId') === readFromPath(sender, 'tab.id')) {
      notify(message);
    }
  });
  chrome.tabs.onUpdated.addListener(function (tabId) {
    if (readFromPath(chrome, 'devtools.inspectedWindow.tabId') === tabId) {
      notify([{ pageRefresh: true }]);
    }
  });
  healthyCheck();
};

wire();

export default bridge;
