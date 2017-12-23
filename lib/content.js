(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/* eslint-disable no-undef, vars-on-top */

var installGlobalHook = require('../src/vendor/react-devtools/backend/installGlobalHook');

var DEBUG = false;
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
  var messagesCount = messagesToSend.length;

  log('sendEvents ' + messagesCount, messagesToSend);
  try {
    chrome.runtime.sendMessage(messagesToSend, function (response) {
      log('response=' + response);
    });
  } catch (error) {
    log('Error:', error);
  }
}
function enhanceEvent(message) {
  return _extends({
    kuker: true,
    time: new Date().getTime(),
    origin: getOrigin()
  }, message);
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
  var message = event.data;

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
    sendEvents([].concat(_toConsumableArray(messages)));
    messages = [];
  });
});

// Injecting __REACT_DEVTOOLS_GLOBAL_HOOK__
var jsToInject = ';(' + installGlobalHook.toString() + '(window))';
var script = document.createElement('script');

script.textContent = jsToInject;
document.documentElement.appendChild(script);
script.parentNode.removeChild(script);

},{"../src/vendor/react-devtools/backend/installGlobalHook":2}],2:[function(require,module,exports){
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */
'use strict';

/**
 * NOTE: This file cannot `require` any other modules. We `.toString()` the
 *       function in some places and inject the source into the page.
 */
function installGlobalHook(window) {
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    return;
  }
  function detectReactBuildType(renderer) {
    try {
      if (typeof renderer.version === 'string') {
        // React DOM Fiber (16+)
        if (renderer.bundleType > 0) {
          // This is not a production build.
          // We are currently only using 0 (PROD) and 1 (DEV)
          // but might add 2 (PROFILE) in the future.
          return 'development';
        }

        // React 16 uses flat bundles. If we report the bundle as production
        // version, it means we also minified and envified it ourselves.
        return 'production';
        // Note: There is still a risk that the CommonJS entry point has not
        // been envified or uglified. In this case the user would have *both*
        // development and production bundle, but only the prod one would run.
        // This would be really bad. We have a separate check for this because
        // it happens *outside* of the renderer injection. See `checkDCE` below.
      }
      var toString = Function.prototype.toString;
      if (renderer.Mount && renderer.Mount._renderNewRootComponent) {
        // React DOM Stack
        var renderRootCode = toString.call(renderer.Mount._renderNewRootComponent);
        // Filter out bad results (if that is even possible):
        if (renderRootCode.indexOf('function') !== 0) {
          // Hope for the best if we're not sure.
          return 'production';
        }
        // Check for React DOM Stack < 15.1.0 in development.
        // If it contains "storedMeasure" call, it's wrapped in ReactPerf (DEV only).
        // This would be true even if it's minified, as method name still matches.
        if (renderRootCode.indexOf('storedMeasure') !== -1) {
          return 'development';
        }
        // For other versions (and configurations) it's not so easy.
        // Let's quickly exclude proper production builds.
        // If it contains a warning message, it's either a DEV build,
        // or an PROD build without proper dead code elimination.
        if (renderRootCode.indexOf('should be a pure function') !== -1) {
          // Now how do we tell a DEV build from a bad PROD build?
          // If we see NODE_ENV, we're going to assume this is a dev build
          // because most likely it is referring to an empty shim.
          if (renderRootCode.indexOf('NODE_ENV') !== -1) {
            return 'development';
          }
          // If we see "development", we're dealing with an envified DEV build
          // (such as the official React DEV UMD).
          if (renderRootCode.indexOf('development') !== -1) {
            return 'development';
          }
          // I've seen process.env.NODE_ENV !== 'production' being smartly
          // replaced by `true` in DEV by Webpack. I don't know how that
          // works but we can safely guard against it because `true` was
          // never used in the function source since it was written.
          if (renderRootCode.indexOf('true') !== -1) {
            return 'development';
          }
          // By now either it is a production build that has not been minified,
          // or (worse) this is a minified development build using non-standard
          // environment (e.g. "staging"). We're going to look at whether
          // the function argument name is mangled:
          if (
          // 0.13 to 15
          renderRootCode.indexOf('nextElement') !== -1 ||
          // 0.12
          renderRootCode.indexOf('nextComponent') !== -1) {
            // We can't be certain whether this is a development build or not,
            // but it is definitely unminified.
            return 'unminified';
          } else {
            // This is likely a minified development build.
            return 'development';
          }
        }
        // By now we know that it's envified and dead code elimination worked,
        // but what if it's still not minified? (Is this even possible?)
        // Let's check matches for the first argument name.
        if (
        // 0.13 to 15
        renderRootCode.indexOf('nextElement') !== -1 ||
        // 0.12
        renderRootCode.indexOf('nextComponent') !== -1) {
          return 'unminified';
        }
        // Seems like we're using the production version.
        // Now let's check if we're still on 0.14 or lower:
        if (renderRootCode.indexOf('._registerComponent') !== -1) {
          // TODO: we can remove the condition above once 16
          // is older than a year. Since this branch only runs
          // for Stack, we can flip it completely when Stack
          // is old enough. The branch for Fiber is above,
          // and it can check renderer.version directly.
          return 'outdated';
        }
        // We're all good.
        return 'production';
      }
    } catch (err) {
      // Weird environments may exist.
      // This code needs a higher fault tolerance
      // because it runs even with closed DevTools.
      // TODO: should we catch errors in all injected code, and not just this part?
    }
    return 'production';
  }

  var hasDetectedBadDCE = false;

  var hook = {
    // Shared between Stack and Fiber:
    _renderers: {},
    helpers: {},
    checkDCE: function checkDCE(fn) {
      // This runs for production versions of React.
      // Needs to be super safe.
      try {
        var toString = Function.prototype.toString;
        var code = toString.call(fn);
        // This is a string embedded in the passed function under DEV-only
        // condition. However the function executes only in PROD. Therefore,
        // if we see it, dead code elimination did not work.
        if (code.indexOf('^_^') > -1) {
          // Remember to report during next injection.
          hasDetectedBadDCE = true;
          // Bonus: throw an exception hoping that it gets picked up by
          // a reporting system. Not synchronously so that it doesn't break the
          // calling code.
          setTimeout(function () {
            throw new Error('React is running in production mode, but dead code ' + 'elimination has not been applied. Read how to correctly ' + 'configure React for production: ' + 'https://fb.me/react-perf-use-the-production-build');
          });
        }
      } catch (err) {}
    },
    inject: function inject(renderer) {
      var id = Math.random().toString(16).slice(2);
      hook._renderers[id] = renderer;
      var reactBuildType = hasDetectedBadDCE ? 'deadcode' : detectReactBuildType(renderer);
      hook.emit('renderer', { id: id, renderer: renderer, reactBuildType: reactBuildType });
      return id;
    },
    _listeners: {},
    sub: function sub(evt, fn) {
      hook.on(evt, fn);
      return function () {
        return hook.off(evt, fn);
      };
    },
    on: function on(evt, fn) {
      if (!hook._listeners[evt]) {
        hook._listeners[evt] = [];
      }
      hook._listeners[evt].push(fn);
    },
    off: function off(evt, fn) {
      if (!hook._listeners[evt]) {
        return;
      }
      var ix = hook._listeners[evt].indexOf(fn);
      if (ix !== -1) {
        hook._listeners[evt].splice(ix, 1);
      }
      if (!hook._listeners[evt].length) {
        hook._listeners[evt] = null;
      }
    },
    emit: function emit(evt, data) {
      if (hook._listeners[evt]) {
        hook._listeners[evt].map(function (fn) {
          return fn(data);
        });
      }
    },
    // Fiber-only:
    supportsFiber: true,
    _fiberRoots: {},
    getFiberRoots: function getFiberRoots(rendererID) {
      var roots = hook._fiberRoots;
      if (!roots[rendererID]) {
        roots[rendererID] = new Set();
      }
      return roots[rendererID];
    },

    onCommitFiberUnmount: function onCommitFiberUnmount(rendererID, fiber) {
      // TODO: can we use hook for roots too?
      if (hook.helpers[rendererID]) {
        hook.helpers[rendererID].handleCommitFiberUnmount(fiber);
      }
    },
    onCommitFiberRoot: function onCommitFiberRoot(rendererID, root) {
      var mountedRoots = hook.getFiberRoots(rendererID);
      var current = root.current;
      var isKnownRoot = mountedRoots.has(root);
      var isUnmounting = current.memoizedState == null || current.memoizedState.element == null;
      // Keep track of mounted roots so we can hydrate when DevTools connect.
      if (!isKnownRoot && !isUnmounting) {
        mountedRoots.add(root);
      } else if (isKnownRoot && isUnmounting) {
        mountedRoots.delete(root);
      }
      if (hook.helpers[rendererID]) {
        hook.helpers[rendererID].handleCommitFiberRoot(root);
      }
    }
  };
  Object.defineProperty(window, '__REACT_DEVTOOLS_GLOBAL_HOOK__', {
    value: hook
  });
}

module.exports = installGlobalHook;

},{}]},{},[1]);
