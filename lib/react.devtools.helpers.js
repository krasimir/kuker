(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/* eslint-disable vars-on-top */
var installGlobalHook = require('../src/vendor/react-devtools/backend/installGlobalHook');
var Backend = require('../src/vendor/react-devtools/backend/backend');
var getData = require('../src/vendor/react-devtools/backend/getData');
var getData012 = require('../src/vendor/react-devtools/backend/getData012');
var getDataFiber = require('../src/vendor/react-devtools/backend/getDataFiber');
var getDisplayName = require('../src/vendor/react-devtools/backend/getDisplayName');

installGlobalHook(window);

var interval = null;
var tries = 10;

(function isReactReady() {
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__ && window.__REACT_DEVTOOLS_GLOBAL_HOOK__._renderers && Object.keys(window.__REACT_DEVTOOLS_GLOBAL_HOOK__._renderers).length > 0) {
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.__helpers = {
      getData: getData, getData012: getData012, getDataFiber: getDataFiber, getDisplayName: getDisplayName
    };
    Backend(window.__REACT_DEVTOOLS_GLOBAL_HOOK__);
  } else {
    if (tries >= 0) {
      tries -= 1;
      clearTimeout(interval);
      interval = setTimeout(isReactReady, 300);
    }
  }
})();

},{"../src/vendor/react-devtools/backend/backend":7,"../src/vendor/react-devtools/backend/getData":9,"../src/vendor/react-devtools/backend/getData012":10,"../src/vendor/react-devtools/backend/getDataFiber":11,"../src/vendor/react-devtools/backend/getDisplayName":12,"../src/vendor/react-devtools/backend/installGlobalHook":13}],2:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if (process.env.NODE_ENV !== 'production') {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

module.exports = invariant;
}).call(this,require('_process'))
},{"_process":3}],3:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],4:[function(require,module,exports){
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

// Copied from React repo.

module.exports = {
  IndeterminateComponent: 0, // Before we know whether it is functional or class
  FunctionalComponent: 1,
  ClassComponent: 2,
  HostRoot: 3, // Root of a host tree. Could be nested inside another node.
  HostPortal: 4, // A subtree. Could be an entry point to a different renderer.
  HostComponent: 5,
  HostText: 6,
  CoroutineComponent: 7,
  CoroutineHandlerPhase: 8,
  YieldComponent: 9,
  Fragment: 10
};

},{}],5:[function(require,module,exports){
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

var getData = require('./getData');
var getData012 = require('./getData012');
var attachRendererFiber = require('./attachRendererFiber');

/**
 * This takes care of patching the renderer to emit events on the global
 * `Hook`. The returned object has a `.cleanup` method to un-patch everything.
 */
function attachRenderer(hook, rid, renderer) {
  var rootNodeIDMap = new Map();
  var extras = {};
  // Before 0.13 there was no Reconciler, so we patch Component.Mixin
  var isPre013 = !renderer.Reconciler;

  // React Fiber
  if (typeof renderer.findFiberByHostInstance === 'function') {
    return attachRendererFiber(hook, rid, renderer);
  }

  // React Native
  if (renderer.Mount.findNodeHandle && renderer.Mount.nativeTagToRootNodeID) {
    extras.getNativeFromReactElement = function (component) {
      return renderer.Mount.findNodeHandle(component);
    };

    extras.getReactElementFromNative = function (nativeTag) {
      var id = renderer.Mount.nativeTagToRootNodeID(nativeTag);
      return rootNodeIDMap.get(id);
    };
    // React DOM 15+
  } else if (renderer.ComponentTree) {
    extras.getNativeFromReactElement = function (component) {
      return renderer.ComponentTree.getNodeFromInstance(component);
    };

    extras.getReactElementFromNative = function (node) {
      return renderer.ComponentTree.getClosestInstanceFromNode(node);
    };
    // React DOM
  } else if (renderer.Mount.getID && renderer.Mount.getNode) {
    extras.getNativeFromReactElement = function (component) {
      try {
        return renderer.Mount.getNode(component._rootNodeID);
      } catch (e) {
        return undefined;
      }
    };

    extras.getReactElementFromNative = function (node) {
      var id = renderer.Mount.getID(node);
      while (node && node.parentNode && !id) {
        node = node.parentNode;
        id = renderer.Mount.getID(node);
      }
      return rootNodeIDMap.get(id);
    };
  } else {
    console.warn('Unknown react version (does not have getID), probably an unshimmed React Native');
  }

  var oldMethods;
  var oldRenderComponent;
  var oldRenderRoot;

  // React DOM
  if (renderer.Mount._renderNewRootComponent) {
    oldRenderRoot = decorateResult(renderer.Mount, '_renderNewRootComponent', function (internalInstance) {
      hook.emit('root', { renderer: rid, internalInstance: internalInstance });
    });
    // React Native
  } else if (renderer.Mount.renderComponent) {
    oldRenderComponent = decorateResult(renderer.Mount, 'renderComponent', function (internalInstance) {
      hook.emit('root', { renderer: rid, internalInstance: internalInstance._reactInternalInstance });
    });
  }

  if (renderer.Component) {
    console.error('You are using a version of React with limited support in this version of the devtools.\nPlease upgrade to use at least 0.13, or you can downgrade to use the old version of the devtools:\ninstructions here https://github.com/facebook/react-devtools/tree/devtools-next#how-do-i-use-this-for-react--013');
    // 0.11 - 0.12
    // $FlowFixMe renderer.Component is not "possibly undefined"
    oldMethods = decorateMany(renderer.Component.Mixin, {
      mountComponent: function mountComponent() {
        var _this = this;

        rootNodeIDMap.set(this._rootNodeID, this);
        // FIXME DOMComponent calls Component.Mixin, and sets up the
        // `children` *after* that call, meaning we don't have access to the
        // children at this point. Maybe we should find something else to shim
        // (do we have access to DOMComponent here?) so that we don't have to
        // setTimeout.
        setTimeout(function () {
          hook.emit('mount', { internalInstance: _this, data: getData012(_this), renderer: rid });
        }, 0);
      },
      updateComponent: function updateComponent() {
        var _this2 = this;

        setTimeout(function () {
          hook.emit('update', { internalInstance: _this2, data: getData012(_this2), renderer: rid });
        }, 0);
      },
      unmountComponent: function unmountComponent() {
        hook.emit('unmount', { internalInstance: this, renderer: rid });
        rootNodeIDMap.delete(this._rootNodeID, this);
      }
    });
  } else if (renderer.Reconciler) {
    oldMethods = decorateMany(renderer.Reconciler, {
      mountComponent: function mountComponent(internalInstance, rootID, transaction, context) {
        var data = getData(internalInstance);
        rootNodeIDMap.set(internalInstance._rootNodeID, internalInstance);
        hook.emit('mount', { internalInstance: internalInstance, data: data, renderer: rid });
      },
      performUpdateIfNecessary: function performUpdateIfNecessary(internalInstance, nextChild, transaction, context) {
        hook.emit('update', { internalInstance: internalInstance, data: getData(internalInstance), renderer: rid });
      },
      receiveComponent: function receiveComponent(internalInstance, nextChild, transaction, context) {
        hook.emit('update', { internalInstance: internalInstance, data: getData(internalInstance), renderer: rid });
      },
      unmountComponent: function unmountComponent(internalInstance) {
        hook.emit('unmount', { internalInstance: internalInstance, renderer: rid });
        rootNodeIDMap.delete(internalInstance._rootNodeID, internalInstance);
      }
    });
  }

  extras.walkTree = function (visit, visitRoot) {
    var onMount = function onMount(component, data) {
      rootNodeIDMap.set(component._rootNodeID, component);
      visit(component, data);
    };
    walkRoots(renderer.Mount._instancesByReactRootID || renderer.Mount._instancesByContainerID, onMount, visitRoot, isPre013);
  };

  extras.cleanup = function () {
    if (oldMethods) {
      if (renderer.Component) {
        restoreMany(renderer.Component.Mixin, oldMethods);
      } else {
        restoreMany(renderer.Reconciler, oldMethods);
      }
    }
    if (oldRenderRoot) {
      renderer.Mount._renderNewRootComponent = oldRenderRoot;
    }
    if (oldRenderComponent) {
      renderer.Mount.renderComponent = oldRenderComponent;
    }
    oldMethods = null;
    oldRenderRoot = null;
    oldRenderComponent = null;
  };

  return extras;
}

function walkRoots(roots, onMount, onRoot, isPre013) {
  for (var name in roots) {
    walkNode(roots[name], onMount, isPre013);
    onRoot(roots[name]);
  }
}

function walkNode(internalInstance, onMount, isPre013) {
  var data = isPre013 ? getData012(internalInstance) : getData(internalInstance);
  if (data.children && Array.isArray(data.children)) {
    data.children.forEach(function (child) {
      return walkNode(child, onMount, isPre013);
    });
  }
  onMount(internalInstance, data);
}

function decorateResult(obj, attr, fn) {
  var old = obj[attr];
  obj[attr] = function (instance) {
    var res = old.apply(this, arguments);
    fn(res);
    return res;
  };
  return old;
}

function decorate(obj, attr, fn) {
  var old = obj[attr];
  obj[attr] = function (instance) {
    var res = old.apply(this, arguments);
    fn.apply(this, arguments);
    return res;
  };
  return old;
}

function decorateMany(source, fns) {
  var olds = {};
  for (var name in fns) {
    olds[name] = decorate(source, name, fns[name]);
  }
  return olds;
}

function restoreMany(source, olds) {
  for (var name in olds) {
    source[name] = olds[name];
  }
}

module.exports = attachRenderer;

},{"./attachRendererFiber":6,"./getData":9,"./getData012":10}],6:[function(require,module,exports){
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

var getDataFiber = require('./getDataFiber');

var _require = require('./ReactTypeOfWork'),
    ClassComponent = _require.ClassComponent,
    HostRoot = _require.HostRoot;

// Inlined from ReactTypeOfSideEffect


var PerformedWork = 1;

function attachRendererFiber(hook, rid, renderer) {
  // This is a slightly annoying indirection.
  // It is currently necessary because DevTools wants
  // to use unique objects as keys for instances.
  // However fibers have two versions.
  // We use this set to remember first encountered fiber for
  // each conceptual instance.
  var opaqueNodes = new Set();
  function getOpaqueNode(fiber) {
    if (opaqueNodes.has(fiber)) {
      return fiber;
    }
    var alternate = fiber.alternate;

    if (alternate != null && opaqueNodes.has(alternate)) {
      return alternate;
    }
    opaqueNodes.add(fiber);
    return fiber;
  }

  function hasDataChanged(prevFiber, nextFiber) {
    if (prevFiber.tag === ClassComponent) {
      // Skip if the class performed no work (shouldComponentUpdate bailout).
      // eslint-disable-next-line no-bitwise
      if ((nextFiber.effectTag & PerformedWork) !== PerformedWork) {
        return false;
      }

      // Only classes have context.
      if (prevFiber.stateNode.context !== nextFiber.stateNode.context) {
        return true;
      }
      // Force updating won't update state or props.
      if (nextFiber.updateQueue != null && nextFiber.updateQueue.hasForceUpdate) {
        return true;
      }
    }
    // Compare the fields that would result in observable changes in DevTools.
    // We don't compare type, tag, index, and key, because these are known to match.
    return prevFiber.memoizedProps !== nextFiber.memoizedProps || prevFiber.memoizedState !== nextFiber.memoizedState || prevFiber.ref !== nextFiber.ref || prevFiber._debugSource !== nextFiber._debugSource;
  }

  var pendingEvents = [];

  function flushPendingEvents() {
    var events = pendingEvents;
    pendingEvents = [];
    for (var i = 0; i < events.length; i++) {
      var event = events[i];
      hook.emit(event.type, event);
    }
  }

  function enqueueMount(fiber) {
    pendingEvents.push({
      internalInstance: getOpaqueNode(fiber),
      data: getDataFiber(fiber, getOpaqueNode),
      renderer: rid,
      type: 'mount'
    });

    var isRoot = fiber.tag === HostRoot;
    if (isRoot) {
      pendingEvents.push({
        internalInstance: getOpaqueNode(fiber),
        renderer: rid,
        type: 'root'
      });
    }
  }

  function enqueueUpdateIfNecessary(fiber, hasChildOrderChanged) {
    if (!hasChildOrderChanged && !hasDataChanged(fiber.alternate, fiber)) {
      return;
    }
    pendingEvents.push({
      internalInstance: getOpaqueNode(fiber),
      data: getDataFiber(fiber, getOpaqueNode),
      renderer: rid,
      type: 'update'
    });
  }

  function enqueueUnmount(fiber) {
    var isRoot = fiber.tag === HostRoot;
    var opaqueNode = getOpaqueNode(fiber);
    var event = {
      internalInstance: opaqueNode,
      renderer: rid,
      type: 'unmount'
    };
    if (isRoot) {
      pendingEvents.push(event);
    } else {
      // Non-root fibers are deleted during the commit phase.
      // They are deleted in the child-first order. However
      // DevTools currently expects deletions to be parent-first.
      // This is why we unshift deletions rather than push them.
      pendingEvents.unshift(event);
    }
    opaqueNodes.delete(opaqueNode);
  }

  function mountFiber(fiber) {
    // Depth-first.
    // Logs mounting of children first, parents later.
    var node = fiber;
    outer: while (true) {
      if (node.child) {
        node.child.return = node;
        node = node.child;
        continue;
      }
      enqueueMount(node);
      if (node == fiber) {
        return;
      }
      if (node.sibling) {
        node.sibling.return = node.return;
        node = node.sibling;
        continue;
      }
      while (node.return) {
        node = node.return;
        enqueueMount(node);
        if (node == fiber) {
          return;
        }
        if (node.sibling) {
          node.sibling.return = node.return;
          node = node.sibling;
          continue outer;
        }
      }
      return;
    }
  }

  function updateFiber(nextFiber, prevFiber) {
    var hasChildOrderChanged = false;
    if (nextFiber.child !== prevFiber.child) {
      // If the first child is different, we need to traverse them.
      // Each next child will be either a new child (mount) or an alternate (update).
      var nextChild = nextFiber.child;
      var prevChildAtSameIndex = prevFiber.child;
      while (nextChild) {
        // We already know children will be referentially different because
        // they are either new mounts or alternates of previous children.
        // Schedule updates and mounts depending on whether alternates exist.
        // We don't track deletions here because they are reported separately.
        if (nextChild.alternate) {
          var prevChild = nextChild.alternate;
          updateFiber(nextChild, prevChild);
          // However we also keep track if the order of the children matches
          // the previous order. They are always different referentially, but
          // if the instances line up conceptually we'll want to know that.
          if (!hasChildOrderChanged && prevChild !== prevChildAtSameIndex) {
            hasChildOrderChanged = true;
          }
        } else {
          mountFiber(nextChild);
          if (!hasChildOrderChanged) {
            hasChildOrderChanged = true;
          }
        }
        // Try the next child.
        nextChild = nextChild.sibling;
        // Advance the pointer in the previous list so that we can
        // keep comparing if they line up.
        if (!hasChildOrderChanged && prevChildAtSameIndex != null) {
          prevChildAtSameIndex = prevChildAtSameIndex.sibling;
        }
      }
      // If we have no more children, but used to, they don't line up.
      if (!hasChildOrderChanged && prevChildAtSameIndex != null) {
        hasChildOrderChanged = true;
      }
    }
    enqueueUpdateIfNecessary(nextFiber, hasChildOrderChanged);
  }

  function walkTree() {
    hook.getFiberRoots(rid).forEach(function (root) {
      // Hydrate all the roots for the first time.
      mountFiber(root.current);
    });
    flushPendingEvents();
  }

  function cleanup() {
    // We don't patch any methods so there is no cleanup.
  }

  function handleCommitFiberUnmount(fiber) {
    // This is not recursive.
    // We can't traverse fibers after unmounting so instead
    // we rely on React telling us about each unmount.
    // It will be flushed after the root is committed.
    enqueueUnmount(fiber);
  }

  function handleCommitFiberRoot(root) {
    var current = root.current;
    var alternate = current.alternate;
    if (alternate) {
      // TODO: relying on this seems a bit fishy.
      var wasMounted = alternate.memoizedState != null && alternate.memoizedState.element != null;
      var isMounted = current.memoizedState != null && current.memoizedState.element != null;
      if (!wasMounted && isMounted) {
        // Mount a new root.
        mountFiber(current);
      } else if (wasMounted && isMounted) {
        // Update an existing root.
        updateFiber(current, alternate);
      } else if (wasMounted && !isMounted) {
        // Unmount an existing root.
        enqueueUnmount(current);
      }
    } else {
      // Mount a new root.
      mountFiber(current);
    }
    // We're done here.
    flushPendingEvents();
  }

  // The naming is confusing.
  // They deal with opaque nodes (fibers), not elements.
  function getNativeFromReactElement(fiber) {
    try {
      var opaqueNode = fiber;
      var hostInstance = renderer.findHostInstanceByFiber(opaqueNode);
      return hostInstance;
    } catch (err) {
      // The fiber might have unmounted by now.
      return null;
    }
  }
  function getReactElementFromNative(hostInstance) {
    var fiber = renderer.findFiberByHostInstance(hostInstance);
    if (fiber != null) {
      // TODO: type fibers.
      var opaqueNode = getOpaqueNode(fiber);
      return opaqueNode;
    }
    return null;
  }
  return {
    getNativeFromReactElement: getNativeFromReactElement,
    getReactElementFromNative: getReactElementFromNative,
    handleCommitFiberRoot: handleCommitFiberRoot,
    handleCommitFiberUnmount: handleCommitFiberUnmount,
    cleanup: cleanup,
    walkTree: walkTree
  };
}

module.exports = attachRendererFiber;

},{"./ReactTypeOfWork":4,"./getDataFiber":11}],7:[function(require,module,exports){
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 *
 * This is the chrome devtools
 *
 * 1. Devtools sets the __REACT_DEVTOOLS_GLOBAL_HOOK__ global.
 * 2. React (if present) calls .inject() with the internal renderer
 * 3. Devtools sees the renderer, and then adds this backend, along with the Agent
 *    and whatever else is needed.
 * 4. The agent then calls `.emit('react-devtools', agent)`
 *
 * Now things are hooked up.
 *
 * When devtools closes, it calls `cleanup()` to remove the listeners
 * and any overhead caused by the backend.
 */
'use strict';

var attachRenderer = require('./attachRenderer');

module.exports = function setupBackend(hook) {
  var oldReact = window.React && window.React.__internals;
  if (oldReact && Object.keys(hook._renderers).length === 0) {
    hook.inject(oldReact);
  }

  for (var rid in hook._renderers) {
    hook.helpers[rid] = attachRenderer(hook, rid, hook._renderers[rid]);
    hook.emit('renderer-attached', { id: rid, renderer: hook._renderers[rid], helpers: hook.helpers[rid] });
  }

  hook.on('renderer', function (_ref) {
    var id = _ref.id,
        renderer = _ref.renderer;

    hook.helpers[id] = attachRenderer(hook, id, renderer);
    hook.emit('renderer-attached', { id: id, renderer: renderer, helpers: hook.helpers[id] });
  });

  var shutdown = function shutdown() {
    for (var id in hook.helpers) {
      hook.helpers[id].cleanup();
    }
    hook.off('shutdown', shutdown);
  };
  hook.on('shutdown', shutdown);

  return true;
};

},{"./attachRenderer":5}],8:[function(require,module,exports){
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

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function copyWithSetImpl(obj, path, idx, value) {
  if (idx >= path.length) {
    return value;
  }
  var key = path[idx];
  var updated = Array.isArray(obj) ? obj.slice() : _extends({}, obj);
  // $FlowFixMe number or string is fine here
  updated[key] = copyWithSetImpl(obj[key], path, idx + 1, value);
  return updated;
}

function copyWithSet(obj, path, value) {
  return copyWithSetImpl(obj, path, 0, value);
}

module.exports = copyWithSet;

},{}],9:[function(require,module,exports){
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

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var copyWithSet = require('./copyWithSet');
var getDisplayName = require('./getDisplayName');
var traverseAllChildrenImpl = require('./traverseAllChildrenImpl');

/**
 * Convert a react internal instance to a sanitized data object.
 */
function getData(internalInstance) {
  var children = null;
  var props = null;
  var state = null;
  var context = null;
  var updater = null;
  var name = null;
  var type = null;
  var key = null;
  var ref = null;
  var source = null;
  var text = null;
  var publicInstance = null;
  var nodeType = 'Native';
  // If the parent is a native node without rendered children, but with
  // multiple string children, then the `element` that gets passed in here is
  // a plain value -- a string or number.
  if ((typeof internalInstance === 'undefined' ? 'undefined' : _typeof(internalInstance)) !== 'object') {
    nodeType = 'Text';
    text = internalInstance + '';
  } else if (internalInstance._currentElement === null || internalInstance._currentElement === false) {
    nodeType = 'Empty';
  } else if (internalInstance._renderedComponent) {
    nodeType = 'NativeWrapper';
    children = [internalInstance._renderedComponent];
    props = internalInstance._instance.props;
    state = internalInstance._instance.state;
    context = internalInstance._instance.context;
    if (context && Object.keys(context).length === 0) {
      context = null;
    }
  } else if (internalInstance._renderedChildren) {
    children = childrenList(internalInstance._renderedChildren);
  } else if (internalInstance._currentElement && internalInstance._currentElement.props) {
    // This is a native node without rendered children -- meaning the children
    // prop is the unfiltered list of children.
    // This may include 'null' or even other invalid values, so we need to
    // filter it the same way that ReactDOM does.
    // Instead of pulling in the whole React library, we just copied over the
    // 'traverseAllChildrenImpl' method.
    // https://github.com/facebook/react/blob/240b84ed8e1db715d759afaae85033718a0b24e1/src/isomorphic/children/ReactChildren.js#L112-L158
    var unfilteredChildren = internalInstance._currentElement.props.children;
    var filteredChildren = [];
    traverseAllChildrenImpl(unfilteredChildren, '', // nameSoFar
    function (_traverseContext, child) {
      var childType = typeof child === 'undefined' ? 'undefined' : _typeof(child);
      if (childType === 'string' || childType === 'number') {
        filteredChildren.push(child);
      }
    }
    // traverseContext
    );
    if (filteredChildren.length <= 1) {
      // children must be an array of nodes or a string or undefined
      // can't be an empty array
      children = filteredChildren.length ? String(filteredChildren[0]) : undefined;
    } else {
      children = filteredChildren;
    }
  }

  if (!props && internalInstance._currentElement && internalInstance._currentElement.props) {
    props = internalInstance._currentElement.props;
  }

  // != used deliberately here to catch undefined and null
  if (internalInstance._currentElement != null) {
    type = internalInstance._currentElement.type;
    if (internalInstance._currentElement.key) {
      key = String(internalInstance._currentElement.key);
    }
    source = internalInstance._currentElement._source;
    ref = internalInstance._currentElement.ref;
    if (typeof type === 'string') {
      name = type;
      if (internalInstance._nativeNode != null) {
        publicInstance = internalInstance._nativeNode;
      }
      if (internalInstance._hostNode != null) {
        publicInstance = internalInstance._hostNode;
      }
    } else if (typeof type === 'function') {
      nodeType = 'Composite';
      name = getDisplayName(type);
      // 0.14 top-level wrapper
      // TODO(jared): The backend should just act as if these don't exist.
      if (internalInstance._renderedComponent && (internalInstance._currentElement.props === internalInstance._renderedComponent._currentElement || internalInstance._currentElement.type.isReactTopLevelWrapper)) {
        nodeType = 'Wrapper';
      }
      if (name === null) {
        name = 'No display name';
      }
    } else if (typeof internalInstance._stringText === 'string') {
      nodeType = 'Text';
      text = internalInstance._stringText;
    } else {
      name = getDisplayName(type);
    }
  }

  if (internalInstance._instance) {
    var inst = internalInstance._instance;

    // A forceUpdate for stateless (functional) components.
    var forceUpdate = inst.forceUpdate || inst.updater && inst.updater.enqueueForceUpdate && function (cb) {
      inst.updater.enqueueForceUpdate(this, cb, 'forceUpdate');
    };
    updater = {
      setState: inst.setState && inst.setState.bind(inst),
      forceUpdate: forceUpdate && forceUpdate.bind(inst),
      setInProps: forceUpdate && setInProps.bind(null, internalInstance, forceUpdate),
      setInState: inst.forceUpdate && setInState.bind(null, inst),
      setInContext: forceUpdate && setInContext.bind(null, inst, forceUpdate)
    };
    if (typeof type === 'function') {
      publicInstance = inst;
    }

    // TODO: React ART currently falls in this bucket, but this doesn't
    // actually make sense and we should clean this up after stabilizing our
    // API for backends
    if (inst._renderedChildren) {
      children = childrenList(inst._renderedChildren);
    }
  }

  if (typeof internalInstance.setNativeProps === 'function') {
    // For editing styles in RN
    updater = {
      setNativeProps: function setNativeProps(nativeProps) {
        internalInstance.setNativeProps(nativeProps);
      }
    };
  }

  return {
    nodeType: nodeType,
    type: type,
    key: key,
    ref: ref,
    source: source,
    name: name,
    props: props,
    state: state,
    context: context,
    children: children,
    text: text,
    updater: updater,
    publicInstance: publicInstance
  };
}

function setInProps(internalInst, forceUpdate, path, value) {
  var element = internalInst._currentElement;
  internalInst._currentElement = _extends({}, element, {
    props: copyWithSet(element.props, path, value)
  });
  forceUpdate.call(internalInst._instance);
}

function setInState(inst, path, value) {
  setIn(inst.state, path, value);
  inst.forceUpdate();
}

function setInContext(inst, forceUpdate, path, value) {
  setIn(inst.context, path, value);
  forceUpdate.call(inst);
}

function setIn(obj, path, value) {
  var last = path.pop();
  var parent = path.reduce(function (obj_, attr) {
    return obj_ ? obj_[attr] : null;
  }, obj);
  if (parent) {
    parent[last] = value;
  }
}

function childrenList(children) {
  var res = [];
  for (var name in children) {
    res.push(children[name]);
  }
  return res;
}

module.exports = getData;

},{"./copyWithSet":8,"./getDisplayName":12,"./traverseAllChildrenImpl":14}],10:[function(require,module,exports){
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

var copyWithSet = require('./copyWithSet');

function getData012(internalInstance) {
  var children = null;
  var props = internalInstance.props;
  var state = internalInstance.state;
  var context = internalInstance.context;
  var updater = null;
  var name = null;
  var type = null;
  var key = null;
  var ref = null;
  var text = null;
  var publicInstance = null;
  var nodeType = 'Native';
  if (internalInstance._renderedComponent) {
    nodeType = 'Wrapper';
    children = [internalInstance._renderedComponent];
    if (context && Object.keys(context).length === 0) {
      context = null;
    }
  } else if (internalInstance._renderedChildren) {
    name = internalInstance.constructor.displayName;
    children = childrenList(internalInstance._renderedChildren);
  } else if (typeof props.children === 'string') {
    // string children
    name = internalInstance.constructor.displayName;
    children = props.children;
    nodeType = 'Native';
  }

  if (!props && internalInstance._currentElement && internalInstance._currentElement.props) {
    props = internalInstance._currentElement.props;
  }

  if (internalInstance._currentElement) {
    type = internalInstance._currentElement.type;
    if (internalInstance._currentElement.key) {
      key = String(internalInstance._currentElement.key);
    }
    ref = internalInstance._currentElement.ref;
    if (typeof type === 'string') {
      name = type;
    } else {
      nodeType = 'Composite';
      name = type.displayName;
      if (!name) {
        name = 'No display name';
      }
    }
  }

  if (!name) {
    name = internalInstance.constructor.displayName || 'No display name';
    nodeType = 'Composite';
  }

  if (typeof props === 'string') {
    nodeType = 'Text';
    text = props;
    props = null;
    name = null;
  }

  if (internalInstance.forceUpdate) {
    updater = {
      setState: internalInstance.setState.bind(internalInstance),
      forceUpdate: internalInstance.forceUpdate.bind(internalInstance),
      setInProps: internalInstance.forceUpdate && setInProps.bind(null, internalInstance),
      setInState: internalInstance.forceUpdate && setInState.bind(null, internalInstance),
      setInContext: internalInstance.forceUpdate && setInContext.bind(null, internalInstance)
    };
    publicInstance = internalInstance;
  }

  return {
    nodeType: nodeType,
    type: type,
    key: key,
    ref: ref,
    source: null,
    name: name,
    props: props,
    state: state,
    context: context,
    children: children,
    text: text,
    updater: updater,
    publicInstance: publicInstance
  };
}

function setInProps(inst, path, value) {
  inst.props = copyWithSet(inst.props, path, value);
  inst.forceUpdate();
}

function setInState(inst, path, value) {
  setIn(inst.state, path, value);
  inst.forceUpdate();
}

function setInContext(inst, path, value) {
  setIn(inst.context, path, value);
  inst.forceUpdate();
}

function setIn(obj, path, value) {
  var last = path.pop();
  var parent = path.reduce(function (obj_, attr) {
    return obj_ ? obj_[attr] : null;
  }, obj);
  if (parent) {
    parent[last] = value;
  }
}

function childrenList(children) {
  var res = [];
  for (var name in children) {
    res.push(children[name]);
  }
  return res;
}

module.exports = getData012;

},{"./copyWithSet":8}],11:[function(require,module,exports){
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

var copyWithSet = require('./copyWithSet');
var getDisplayName = require('./getDisplayName');

var _require = require('./ReactTypeOfWork'),
    FunctionalComponent = _require.FunctionalComponent,
    ClassComponent = _require.ClassComponent,
    HostRoot = _require.HostRoot,
    HostPortal = _require.HostPortal,
    HostComponent = _require.HostComponent,
    HostText = _require.HostText,
    Fragment = _require.Fragment;

// TODO: we might want to change the data structure
// once we no longer suppport Stack versions of `getData`.


function getDataFiber(fiber, getOpaqueNode) {
  var type = fiber.type;
  var key = fiber.key;
  var ref = fiber.ref;
  var source = fiber._debugSource;
  var publicInstance = null;
  var props = null;
  var state = null;
  var children = null;
  var context = null;
  var updater = null;
  var nodeType = null;
  var name = null;
  var text = null;

  switch (fiber.tag) {
    case FunctionalComponent:
    case ClassComponent:
      nodeType = 'Composite';
      name = getDisplayName(fiber.type);
      publicInstance = fiber.stateNode;
      props = fiber.memoizedProps;
      state = fiber.memoizedState;
      if (publicInstance != null) {
        context = publicInstance.context;
        if (context && Object.keys(context).length === 0) {
          context = null;
        }
      }
      var inst = publicInstance;
      if (inst) {
        updater = {
          setState: inst.setState && inst.setState.bind(inst),
          forceUpdate: inst.forceUpdate && inst.forceUpdate.bind(inst),
          setInProps: inst.forceUpdate && setInProps.bind(null, fiber),
          setInState: inst.forceUpdate && setInState.bind(null, inst),
          setInContext: inst.forceUpdate && setInContext.bind(null, inst)
        };
      }
      children = [];
      break;
    case HostRoot:
      nodeType = 'Wrapper';
      children = [];
      break;
    case HostPortal:
      nodeType = 'Portal';
      name = 'ReactPortal';
      props = {
        target: fiber.stateNode.containerInfo
      };
      children = [];
      break;
    case HostComponent:
      nodeType = 'Native';
      name = fiber.type;

      // TODO (bvaughn) we plan to remove this prefix anyway.
      // We can cut this special case out when it's gone.
      name = name.replace('topsecret-', '');

      publicInstance = fiber.stateNode;
      props = fiber.memoizedProps;
      if (typeof props.children === 'string' || typeof props.children === 'number') {
        children = props.children.toString();
      } else {
        children = [];
      }
      if (typeof fiber.stateNode.setNativeProps === 'function') {
        // For editing styles in RN
        updater = {
          setNativeProps: function setNativeProps(nativeProps) {
            fiber.stateNode.setNativeProps(nativeProps);
          }
        };
      }
      break;
    case HostText:
      nodeType = 'Text';
      text = fiber.memoizedProps;
      break;
    case Fragment:
      nodeType = 'Wrapper';
      children = [];
      break;
    default:
      // Coroutines and yields
      nodeType = 'Native';
      props = fiber.memoizedProps;
      name = 'TODO_NOT_IMPLEMENTED_YET';
      children = [];
      break;
  }

  if (Array.isArray(children)) {
    var child = fiber.child;
    while (child) {
      children.push(getOpaqueNode(child));
      child = child.sibling;
    }
  }

  return {
    nodeType: nodeType,
    type: type,
    key: key,
    ref: ref,
    source: source,
    name: name,
    props: props,
    state: state,
    context: context,
    children: children,
    text: text,
    updater: updater,
    publicInstance: publicInstance
  };
}

function setInProps(fiber, path, value) {
  var inst = fiber.stateNode;
  fiber.pendingProps = copyWithSet(inst.props, path, value);
  if (fiber.alternate) {
    // We don't know which fiber is the current one because DevTools may bail out of getDataFiber() call,
    // and so the data object may refer to another version of the fiber. Therefore we update pendingProps
    // on both. I hope that this is safe.
    fiber.alternate.pendingProps = fiber.pendingProps;
  }
  fiber.stateNode.forceUpdate();
}

function setInState(inst, path, value) {
  setIn(inst.state, path, value);
  inst.forceUpdate();
}

function setInContext(inst, path, value) {
  setIn(inst.context, path, value);
  inst.forceUpdate();
}

function setIn(obj, path, value) {
  var last = path.pop();
  var parent = path.reduce(function (obj_, attr) {
    return obj_ ? obj_[attr] : null;
  }, obj);
  if (parent) {
    parent[last] = value;
  }
}

module.exports = getDataFiber;

},{"./ReactTypeOfWork":4,"./copyWithSet":8,"./getDisplayName":12}],12:[function(require,module,exports){
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

var FB_MODULE_RE = /^(.*) \[from (.*)\]$/;
var cachedDisplayNames = new WeakMap();

function getDisplayName(type) {
  if (cachedDisplayNames.has(type)) {
    return cachedDisplayNames.get(type);
  }

  var displayName = void 0;

  // The displayName property is not guaranteed to be a string.
  // It's only safe to use for our purposes if it's a string.
  // github.com/facebook/react-devtools/issues/803
  if (typeof type.displayName === 'string') {
    displayName = type.displayName;
  }

  if (!displayName) {
    displayName = type.name || 'Unknown';
  }

  // Facebook-specific hack to turn "Image [from Image.react]" into just "Image".
  // We need displayName with module name for error reports but it clutters the DevTools.
  var match = displayName.match(FB_MODULE_RE);
  if (match) {
    var componentName = match[1];
    var moduleName = match[2];
    if (componentName && moduleName) {
      if (moduleName === componentName || moduleName.startsWith(componentName + '.')) {
        displayName = componentName;
      }
    }
  }

  cachedDisplayNames.set(type, displayName);
  return displayName;
}

module.exports = getDisplayName;

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var invariant = require('fbjs/lib/invariant');

var SEPARATOR = '.';
var SUBSEPARATOR = ':';

var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.
// The Symbol used to tag the ReactElement type. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
var REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol.for && Symbol.for('react.element') || 0xeac7;

/**
 * Escape and wrap key so it is safe to use as a reactid
 *
 * @param {string} key to be escaped.
 * @return {string} the escaped key.
 */
function escape(key) {
  var escapeRegex = /[=:]/g;
  var escaperLookup = {
    '=': '=0',
    ':': '=2'
  };
  var escapedString = ('' + key).replace(escapeRegex, function (match) {
    return escaperLookup[match];
  });

  return '$' + escapedString;
}

/**
 * Generate a key string that identifies a component within a set.
 *
 * @param {*} component A component that could contain a manual key.
 * @param {number} index Index that is used if a manual key is not provided.
 * @return {string}
 */
function getComponentKey(component, index) {
  // Do some typechecking here since we call this blindly. We want to ensure
  // that we don't block potential future ES APIs.
  if ((typeof component === 'undefined' ? 'undefined' : _typeof(component)) === 'object' && component !== null && component.key != null) {
    // Explicit key
    return escape(component.key);
  }
  // Implicit key determined by the index in the set
  return index.toString(36);
}

/**
 * We do a copied the 'traverseAllChildrenImpl' method from
 * `React.Children` so that we don't pull in the whole React library.
 * @param {?*} children Children tree container.
 * @param {!string} nameSoFar Name of the key path so far.
 * @param {!function} callback Callback to invoke with each child found.
 * @param {?*} traverseContext Used to pass information throughout the traversal
 * process.
 * @return {!number} The number of children in this subtree.
 */
function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
  var type = typeof children === 'undefined' ? 'undefined' : _typeof(children);

  if (type === 'undefined' || type === 'boolean') {
    // All of the above are perceived as null.
    children = null;
  }

  if (children === null || type === 'string' || type === 'number' ||
  // The following is inlined from ReactElement. This means we can optimize
  // some checks. React Fiber also inlines this logic for similar purposes.
  type === 'object' && children.$$typeof === REACT_ELEMENT_TYPE) {
    callback(traverseContext, children,
    // If it's the only child, treat the name as if it was wrapped in an array
    // so that it's consistent if the number of children grows.
    nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
    return 1;
  }

  var child;
  var nextName;
  var subtreeCount = 0; // Count of children found in the current subtree.
  var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getComponentKey(child, i);
      subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
    }
  } else {
    var iteratorFn = ITERATOR_SYMBOL && children[ITERATOR_SYMBOL] || children[FAUX_ITERATOR_SYMBOL];
    if (typeof iteratorFn === 'function') {
      var iterator = iteratorFn.call(children);
      var step;
      var ii = 0;
      while (!(step = iterator.next()).done) {
        child = step.value;
        nextName = nextNamePrefix + getComponentKey(child, ii++);
        subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
      }
    } else if (type === 'object') {
      var addendum = ' If you meant to render a collection of children, use an array ' + 'instead.';
      var childrenString = '' + children;
      invariant(false, 'The React Devtools cannot render an object as a child. (found: %s).%s', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum);
    }
  }

  return subtreeCount;
}

module.exports = traverseAllChildrenImpl;

},{"fbjs/lib/invariant":2}]},{},[1]);
