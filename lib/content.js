/* eslint-disable no-undef */

var messages = [];
var ID = '__kuker__is_here__';
var requestAnimationFrameRequest = null;
var interval = null;

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
function sendEvents(messagesToSend) {
  const messagesCount = messagesToSend.length;

  // console.log('sendEvents ' + messagesCount);
  chrome.runtime.sendMessage(messages, response => {
    // console.log('response=' + response);
    if (!response || response !== 'received') {
      clearTimeout(interval);
      interval = setTimeout(function () {
        sendEvents(messagesToSend);
      }, 2000);
    }
  });
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

  cancelAnimationFrame(requestAnimationFrameRequest);
  requestAnimationFrameRequest = window.requestAnimationFrame(function () {
    sendEvents([...messages]);
    messages = [];
  });
});

register();
clearEvents();
