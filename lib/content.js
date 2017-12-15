/* eslint-disable no-undef */

var messages = [];
var ID = '__kuker__is_here__';

function register() {
  const scriptTag = document.createElement('script');

  scriptTag.src = chrome.extension.getURL('scripts/script.js');
  scriptTag.onload = function () {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(scriptTag);
}
function isHealthy() {
  return !!(document.querySelector('#' + ID));
}
function clearEvents() {
  chrome.runtime.sendMessage([{ pageRefresh: true }]);
}

// communication with devtools
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message && message.isHealthy === true) {
    const healthy = isHealthy();

    sendResponse({ healthy });
    if (!healthy) {
      register();
    }
  }
});

// Listening for application events
window.addEventListener('message', function (event) {
  const message = event.data;

  message.origin = location.href;
  messages.push(message);

  window.requestAnimationFrame(function (timeStamp) {
    if (messages.length > 0) {
      chrome.runtime.sendMessage(messages);
      messages = [];
    }
  });
});

register();
clearEvents();
