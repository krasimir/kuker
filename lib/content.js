/* eslint-disable no-undef */

const DEBUG = false;
var isFirstMessage = true;
var messages = [];
var requestAnimationFrameRequest = null;

function log(what, data) {
  if (!DEBUG) return;
  console.log(what, data);
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
function getOrigin() {
  if (location && location.protocol && location.host && location.pathname) {
    return location.protocol + '//' + location.host;
  }
  return '';
}

// From DevTools to content script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  log('-> DevTools', message);
  if (message && message.type) {
    switch (message.type) {
      case 'console.log':
        console.log.apply(console, message.data);
        break;
    }
  }
});

// From page/content script to DevTools
window.addEventListener('message', function (event) {
  const message = event.data;

  log('-> Page', message);

  message.origin = getOrigin();
  if (isFirstMessage) {
    messages.push({ type: 'NEW_SESSION', origin: message.origin });
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

/*
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
*/
