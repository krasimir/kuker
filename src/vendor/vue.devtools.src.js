import { installHook } from 'src/backend/hook';

const MAX_MESSAGES_TO_CACHE = 50;
const HOOK_KEY = '__VUE_DEVTOOLS_GLOBAL_HOOK__';
const KUKER_HOOK_KEY = '__KUKER_VUE_HOOK__';
var detectAttempts = 5;

const detect = function (callback) {
  detectAttempts -= 1;

  if (window[HOOK_KEY] && !!window[HOOK_KEY].Vue) {
    callback(null, window[HOOK_KEY]);
  } else {
    if (detectAttempts === 0) {
      callback('Can not detect Vue on the page!');
    }
    setTimeout(() => detect(callback), 1000);
  }
};

installHook(window);
detect(() => {
  const listeners = [];
  const bridgeListeners = {};
  const { initBackend } = require('src/backend/index');
  const messages = [];

  window[KUKER_HOOK_KEY] = {
    listen: function (callback) {
      listeners.push(callback);
      messages.forEach(({ type, payload }) => callback(type, payload));
    }
  };

  initBackend({
    on: function (type, callback) {
      if (!bridgeListeners[type]) bridgeListeners[type] = [];
      bridgeListeners[type].push(callback);
    },
    send: function (type, payload) {
      console.log('------------> ' + type);
      if (messages.length > MAX_MESSAGES_TO_CACHE) messages.shift();
      messages.push({ type, payload });
      if (type === 'flush' && bridgeListeners['select-instance']) {
        // bridgeListeners['select-instance'][0]('1:5');
      }
      listeners.forEach(l => l(type, payload));
    },
    log: function () {}
  });
});

