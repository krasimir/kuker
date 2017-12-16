/* eslint-disable no-undef */

const DEBUG = false;
var messages = [];
var requestAnimationFrameRequest = null;
var interval = null;

function log(what, data) {
  if (!DEBUG) return;
  console.log(what, data);
}
function clearEvents() {
  chrome.runtime.sendMessage([{ pageRefresh: true }]);
}
function sendEvents(messagesToSend) {
  const messagesCount = messagesToSend.length;

  log('sendEvents ' + messagesCount, messagesToSend);
  try {
    chrome.runtime.sendMessage(messagesToSend, response => {
      log('response=' + response);
      if (!response || response !== 'received') {
        clearTimeout(interval);
        interval = setTimeout(function () {
          sendEvents(messagesToSend);
        }, 2000);
      }
    });
  } catch (error) {
    log('Error:', error);
  }
}

// From DevTools to content script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  log('-> DevTools', message);
});

// From page/content script to DevTools
window.addEventListener('message', function (event) {
  const message = event.data;

  log('-> Page', message);

  message.origin = location.href;
  messages.push(message);

  log('-> current messages', messages.length);

  cancelAnimationFrame(requestAnimationFrameRequest);
  requestAnimationFrameRequest = window.requestAnimationFrame(function () {
    sendEvents([...messages]);
    messages = [];
  });
});

clearEvents();

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
