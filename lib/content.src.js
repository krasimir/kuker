/* eslint-disable no-undef, vars-on-top */

var installGlobalHook = require('../src/vendor/react-devtools/backend/installGlobalHook');

const DEBUG = false;
var isFirstMessage = true;
var messages = [];
var requestAnimationFrameRequest = null;

function log(what, data) {
  if (!DEBUG) return;
  console.log(what, data);
}
function getOrigin() {
  if (typeof location !== 'undefined' && location.protocol && location.host) {
    return location.protocol + '//' + location.host;
  }
  return '';
}
function sendEvents(messagesToSend) {
  const messagesCount = messagesToSend.length;

  log('sendEvents ' + messagesCount, messagesToSend);
  try {
    chrome.runtime.sendMessage(messagesToSend, response => {
      log('response=' + response);
    });
  } catch (error) {
    log('Error:', error);
  }
}
function enhanceEvent(message) {
  return {
    kuker: true,
    time: (new Date()).getTime(),
    origin: getOrigin(),
    ...message
  };
}

// From DevTools to content script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  log('-> DevTools', message);
  if (message && message.type) {
    switch (message.type) {
      case 'console.log':
        console.log.apply(console, message.data);
        break;
      case 'get-page-url':
        sendResponse(getOrigin());
        break;
    }
  }
});

// From page/content script to DevTools
window.addEventListener('message', function (event) {
  const message = event.data;

  log('-> Page', message);

  if (typeof message.kuker === 'undefined') return;
  if (isFirstMessage) {
    messages.push(enhanceEvent({ type: 'NEW_SESSION' }));
    isFirstMessage = false;
  }
  messages.push(message);

  log('-> current messages', messages.length);

  cancelAnimationFrame(requestAnimationFrameRequest);
  requestAnimationFrameRequest = window.requestAnimationFrame(function () {
    sendEvents([...messages]);
    messages = [];
  });
});

// Injecting __REACT_DEVTOOLS_GLOBAL_HOOK__
const jsToInject = (';(' + installGlobalHook.toString() + '(window))');
const script = document.createElement('script');

script.textContent = jsToInject;
document.documentElement.appendChild(script);
script.parentNode.removeChild(script);
