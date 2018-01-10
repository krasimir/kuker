import { installHook } from 'src/backend/hook';
import { sanitize } from 'kuker-emitters';

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
detect(error => {
  if (error) return;

  const listeners = [];
  const bridgeListeners = {};
  const { initBackend, getInstanceDetails } = require('src/backend/index');
  const messages = [];
  const defaultInstanceCharacteristics = { data: {}, computed: {}, props: {} };

  window[KUKER_HOOK_KEY] = {
    listen: function (callback) {
      listeners.push(callback);
      messages.forEach(({ type, payload }) => callback(type, payload));
    }
  };

  function populateVueTreeWithInstanceDetails(tree) {
    return (function process(node) {
      if (node && node.id) {
        const { name, state } = getInstanceDetails(node.id);
        const { data, computed, props } = state && Array.isArray(state) ? state.reduce((result, item) => {
          if (item.type === 'computed') {
            result.computed[item.key] = item.value;
          } else if (item.type === 'props') {
            result.props[item.key] = item.value;
          } else {
            result.data[item.key] = item.value;
          }
          return result;
        }, defaultInstanceCharacteristics) : defaultInstanceCharacteristics;

        node = Object.assign(
          node,
          name && { name },
          { data: sanitize(data), computed: sanitize(computed), props: sanitize(props) }
        );
      }
      if (node.children && node.children.length > 0) {
        node.children = node.children.map(process);
      }
      return node;
    })({
      name: 'Vue',
      state: {},
      children: tree.instances || []
    });
  }

  initBackend({
    on: function (type, callback) {
      // we are currently not using these listeners but who knows ...
      if (!bridgeListeners[type]) bridgeListeners[type] = [];
      bridgeListeners[type].push(callback);
    },
    send: function (type, payload) {
      if (messages.length > MAX_MESSAGES_TO_CACHE) messages.shift();
      if (type === 'flush') {
        try {
          payload = populateVueTreeWithInstanceDetails(JSON.parse(payload));
        } catch (error) {
          console.error('Vue tree can not be deserialized to json.');
          payload = {};
        }
      }
      messages.push({ type, payload });
      listeners.forEach(l => l(type, payload));
    },
    log: function () {}
  });
});

