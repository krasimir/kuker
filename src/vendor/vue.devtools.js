(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function encode (data, replacer, list, seen) {
  var stored, key, value, i, l
  var seenIndex = seen.get(data)
  if (seenIndex != null) {
    return seenIndex
  }
  var index = list.length
  if (isPlainObject(data)) {
    stored = {}
    seen.set(data, index)
    list.push(stored)
    var keys = Object.keys(data)
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i]
      value = data[key]
      if (replacer) {
        value = replacer.call(data, key, value)
      }
      stored[key] = encode(value, replacer, list, seen)
    }
  } else if (Array.isArray(data)) {
    stored = []
    seen.set(data, index)
    list.push(stored)
    for (i = 0, l = data.length; i < l; i++) {
      value = data[i]
      if (replacer) {
       value = replacer.call(data, i, value)
      }
      stored[i] = encode(value, replacer, list, seen)
    }
  } else {
    index = list.length
    list.push(data)
  }
  return index
}

function decode (list, reviver) {
  var i = list.length
  var j, k, data, key, value
  while (i--) {
    var data = list[i]
    if (isPlainObject(data)) {
      var keys = Object.keys(data)
      for (j = 0, k = keys.length; j < k; j++) {
        key = keys[j]
        value = list[data[key]]
        if (reviver) value = reviver.call(data, key, value)
        data[key] = value
      }
    } else if (Array.isArray(data)) {
      for (j = 0, k = data.length; j < k; j++) {
        value = list[data[j]]
        if (reviver) value = reviver.call(data, j, value)
        data[j] = value
      }
    }
  }
}

function isPlainObject (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

exports.stringify = function stringify (data, replacer, space) {
  try {
    return arguments.length === 1
      ? JSON.stringify(data)
      : JSON.stringify(data, replacer, space)
  } catch (e) {
    return exports.stringifyStrict(data, replacer, space)
  }
}

exports.parse = function parse (data, reviver) {
  var hasCircular = /^\s/.test(data)
  if (!hasCircular) {
    return arguments.length === 1
      ? JSON.parse(data)
      : JSON.parse(data, reviver)
  } else {
    var list = JSON.parse(data)
    decode(list, reviver)
    return list[0]
  }
}

exports.stringifyStrict = function (data, replacer, space) {
  var list = []
  encode(data, replacer, list, new Map())
  return space
    ? ' ' + JSON.stringify(list, null, space)
    : ' ' + JSON.stringify(list)
}

},{}],2:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.default = BaseEmitter;

var _sanitize = require('./helpers/sanitize');

var _sanitize2 = _interopRequireDefault(_sanitize);

var _createMessenger = require('./helpers/createMessenger');

var _createMessenger2 = _interopRequireDefault(_createMessenger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function BaseEmitter() {
  var message = (0, _createMessenger2.default)('BaseEmitter');

  return function (data) {
    return message((0, _sanitize2.default)(data));
  };
};
module.exports = exports['default'];
},{"./helpers/createMessenger":9,"./helpers/sanitize":10}],3:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.default = MachinaEmitter;

var _sanitize = require('./helpers/sanitize');

var _sanitize2 = _interopRequireDefault(_sanitize);

var _createMessenger = require('./helpers/createMessenger');

var _createMessenger2 = _interopRequireDefault(_createMessenger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function MachinaEmitter(machine) {
  var message = (0, _createMessenger2.default)('MachinaEmitter');

  machine.on('*', function (eventName, data) {
    message({
      type: 'Machina_' + eventName,
      label: typeof machine.state === 'string' ? machine.state : '',
      state: (0, _sanitize2.default)(machine.state),
      data: (0, _sanitize2.default)(data)
    });
  });
};
module.exports = exports['default'];
},{"./helpers/createMessenger":9,"./helpers/sanitize":10}],4:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = MobXEmitter;

var _sanitize = require('./helpers/sanitize');

var _sanitize2 = _interopRequireDefault(_sanitize);

var _createMessenger = require('./helpers/createMessenger');

var _createMessenger2 = _interopRequireDefault(_createMessenger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function MobXEmitter(spy, stores) {
  var message = (0, _createMessenger2.default)('MobXEmitter');
  var emit = function emit(data) {
    return message((0, _sanitize2.default)(data));
  };
  var state = stores.reduce(function (result, store) {
    result[store.constructor.name] = store;
    return result;
  }, {});
  var indent = 0;

  spy(function (event) {
    var type = '@mobx_' + (event.type || 'spyReportEnd');

    if (event.spyReportEnd) indent -= 1;

    emit({
      type: type,
      state: state,
      event: _extends({}, event, { indent: indent })
    });

    if (event.spyReportStart) indent += 1;
  });
};
module.exports = exports['default'];
},{"./helpers/createMessenger":9,"./helpers/sanitize":10}],5:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.throttle = exports.traverseReactTree = exports.Node = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = ReactEmitter;

var _createMessenger = require('./helpers/createMessenger');

var _createMessenger2 = _interopRequireDefault(_createMessenger);

var _sanitize = require('./helpers/sanitize');

var _sanitize2 = _interopRequireDefault(_sanitize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

// Implementation taken from https://github.com/facebook/react-devtools/blob/master/backend/attachRenderer.js#L175-L181
// If this breaks make sure that it is in sync with the original

var tries = 5;

var Node = function Node() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  // eslint-disable-next-line
  var _ref = data.props || {},
      children = _ref.children,
      otherProps = _objectWithoutProperties(_ref, ['children']);

  return {
    name: data.name,
    props: (0, _sanitize2.default)(_extends({}, otherProps)),
    state: (0, _sanitize2.default)(data.state),
    children: []
  };
};

exports.Node = Node;
var traverseReactTree = exports.traverseReactTree = function traverseReactTree(root, renderer, _ref2) {
  var getData = _ref2.getData,
      getData012 = _ref2.getData012,
      getDataFiber = _ref2.getDataFiber,
      getDisplayName = _ref2.getDisplayName;

  if (!root) return {};

  var isPre013 = !renderer.Reconciler;
  var walkNode = function walkNode(internalInstance) {
    var data = isPre013 ? getData012(internalInstance) : getData(internalInstance);
    var item = Node(data);

    if (data.children && Array.isArray(data.children)) {
      item.children = data.children.map(function (child) {
        return walkNode(child);
      });
    }
    return item;
  };

  return walkNode(root);
};

var throttle = exports.throttle = function throttle(func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  var throttleMeta = { calls: 0, components: [] };

  var processThrottledCall = function processThrottledCall(_ref3) {
    var data = _ref3.data;

    throttleMeta.calls += 1;
    data && data.name && throttleMeta.components.push(data.name);
  };
  var resetThrottleMeta = function resetThrottleMeta() {
    throttleMeta = { calls: 0, components: [] };
  };
  var later = function later() {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, [throttleMeta].concat(args));
    resetThrottleMeta();
    if (!timeout) context = args = null;
  };

  if (!options) options = {};

  return function () {
    var now = Date.now();

    processThrottledCall.apply(undefined, arguments);
    if (!previous && options.leading === false) previous = now;

    // eslint-disable-next-line
    var remaining = wait - (now - previous);

    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, [throttleMeta].concat(args));
      resetThrottleMeta();
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};

var connect = function connect(callback) {
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    callback(window.__REACT_DEVTOOLS_GLOBAL_HOOK__);
    return;
  }
  if (tries >= 0) {
    tries -= 1;
    setTimeout(function () {
      return connect(callback);
    }, 1500);
  }
};

function ReactEmitter() {
  if (typeof window === 'undefined') return;

  var postMessage = (0, _createMessenger2.default)('ReactEmitter');

  connect(function (hook) {
    var getState = function getState() {
      return {};
    };

    hook.on('renderer-attached', function (attached) {
      var helpers = attached.helpers,
          renderer = attached.renderer;

      var rootNode = null;

      (function findRootNode() {
        helpers.walkTree(function () {}, function (root) {
          var rootData = hook.__helpers.getData(root);

          rootNode = root;
          if (rootData.name === 'TopLevelWrapper' && rootData.children && rootData.children.length === 1) {
            root = rootData.children[0];
          }
          getState = function getState() {
            return (0, _sanitize2.default)(traverseReactTree(root, renderer, hook.__helpers));
          };
          postMessage({
            type: '@@react_root_detected',
            state: getState()
          });
        });
        if (rootNode === null) {
          setTimeout(findRootNode, 300);
        }
      })();
    });
    hook.on('root', throttle(function (_ref4) {
      var calls = _ref4.calls,
          components = _ref4.components;

      postMessage({
        type: '@@react_root',
        state: getState(),
        calls: calls,
        components: components
      });
    }), 100);
    hook.on('mount', throttle(function (_ref5) {
      var calls = _ref5.calls,
          components = _ref5.components;

      postMessage({
        type: '@@react_mount',
        state: getState(),
        calls: calls,
        components: components
      });
    }), 100);
    hook.on('update', throttle(function (_ref6) {
      var calls = _ref6.calls,
          components = _ref6.components;

      postMessage({
        type: '@@react_update',
        state: getState(),
        calls: calls,
        components: components
      });
    }), 100);
    hook.on('unmount', throttle(function (_ref7) {
      var calls = _ref7.calls,
          components = _ref7.components;

      postMessage({
        type: '@@react_unmount',
        state: getState(),
        calls: calls,
        components: components
      });
    }), 100);
  });
};
},{"./helpers/createMessenger":9,"./helpers/sanitize":10}],6:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.default = ReduxEmitter;

var _sanitize = require('./helpers/sanitize');

var _sanitize2 = _interopRequireDefault(_sanitize);

var _createMessenger = require('./helpers/createMessenger');

var _createMessenger2 = _interopRequireDefault(_createMessenger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NOOP = function NOOP() {
  return function (noop) {
    return noop;
  };
};

function ReduxEmitter() {
  var message = (0, _createMessenger2.default)('ReduxEmitter', 'Redux library');

  return function middleware(_ref) {
    var getState = _ref.getState,
        dispatch = _ref.dispatch;

    return function (next) {
      return function (action) {
        var result = next(action);

        message({
          state: (0, _sanitize2.default)(getState()),
          type: '@redux_ACTION',
          action: (0, _sanitize2.default)(action)
        });
        return result;
      };
    };
  };
};
module.exports = exports['default'];
},{"./helpers/createMessenger":9,"./helpers/sanitize":10}],7:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* eslint-disable max-len */


exports.default = ReduxSagaEmitter;

var _sanitize = require('./helpers/sanitize');

var _sanitize2 = _interopRequireDefault(_sanitize);

var _createMessenger = require('./helpers/createMessenger');

var _createMessenger2 = _interopRequireDefault(_createMessenger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var store = null;

var getState = function getState() {
  if (store) return store.getState();
  return { '<unknown>': 'You forgot to call `emitter.setStore(<your store>)`. Please check https://github.com/krasimir/kuker-emitters' };
};

var NOOP = { sagaMonitor: null, setStore: function setStore() {} };

function ReduxSagaEmitter() {
  var message = (0, _createMessenger2.default)('ReduxEmitter', 'Redux-Saga library');
  var sendMessage = function sendMessage(data) {
    message(_extends({
      state: (0, _sanitize2.default)(getState())
    }, data));
  };

  return {
    sagaMonitor: {
      effectTriggered: function effectTriggered(_ref) {
        var effectId = _ref.effectId,
            parentEffectId = _ref.parentEffectId,
            label = _ref.label,
            effect = _ref.effect;

        sendMessage(_extends({
          type: '@saga_effectTriggered'
        }, (0, _sanitize2.default)({ effectId: effectId, parentEffectId: parentEffectId, label: label, effect: effect })));
      },
      effectResolved: function effectResolved(effectId, result) {
        sendMessage(_extends({
          type: '@saga_effectResolved'
        }, (0, _sanitize2.default)({ effectId: effectId, result: result })));
      },
      effectRejected: function effectRejected(effectId, error) {

        sendMessage(_extends({
          type: '@saga_effectRejected'
        }, (0, _sanitize2.default)({ effectId: effectId, error: error })));
      },
      effectCancelled: function effectCancelled(effectId) {
        sendMessage({
          type: '@saga_effectCancelled',
          effectId: effectId
        });
      },
      actionDispatched: function actionDispatched(action) {
        sendMessage(_extends({
          type: '@saga_actionDispatched'
        }, (0, _sanitize2.default)({ action: action })));
      }
    },
    setStore: function setStore(s) {
      store = s;
    }
  };
};
module.exports = exports['default'];
},{"./helpers/createMessenger":9,"./helpers/sanitize":10}],8:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _sanitize = require('./helpers/sanitize');

var _sanitize2 = _interopRequireDefault(_sanitize);

var _createMessenger = require('./helpers/createMessenger');

var _createMessenger2 = _interopRequireDefault(_createMessenger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Machine;

var formatYielded = function formatYielded(yielded) {
  var y = yielded;

  if (yielded && yielded.__type === 'call') {
    var funcName = yielded.func.name;

    if (funcName === '') {
      funcName = '<anonymous>';
    };
    try {
      y = (0, _sanitize2.default)(yielded);
    } catch (error) {
      y = { __type: 'call' };
    }
    y.func = funcName;
  }

  return y;
};

var getMetaInfo = function getMetaInfo(meta) {
  return Object.assign({}, meta, {
    middlewares: Machine.middlewares.length
  });
};

var StentEmitter = function StentEmitter() {
  var message = (0, _createMessenger2.default)('StentEmitter');
  var postMessage = function postMessage(data) {
    var machines = Object.keys(Machine.machines).map(function (name) {
      return { name: name, state: (0, _sanitize2.default)(Machine.machines[name].state) };
    });

    message(_extends({ state: machines }, data));
  };

  return {
    __sanitize: _sanitize2.default,
    __formatYielded: formatYielded,
    __message: message,
    __initialize: function __initialize(m) {
      Machine = m;
    },
    onMachineCreated: function onMachineCreated(machine) {
      postMessage({
        type: 'onMachineCreated',
        machine: (0, _sanitize2.default)(machine),
        meta: getMetaInfo()
      });
    },
    onActionDispatched: function onActionDispatched(actionName) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      postMessage({
        type: 'onActionDispatched',
        actionName: actionName,
        args: (0, _sanitize2.default)(args),
        machine: (0, _sanitize2.default)(this),
        meta: getMetaInfo()
      });
    },
    onActionProcessed: function onActionProcessed(actionName) {
      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      postMessage({
        type: 'onActionProcessed',
        actionName: actionName,
        args: (0, _sanitize2.default)(args),
        machine: (0, _sanitize2.default)(this),
        meta: getMetaInfo()
      });
    },
    onStateWillChange: function onStateWillChange() {
      postMessage({
        type: 'onStateWillChange',
        machine: (0, _sanitize2.default)(this),
        meta: getMetaInfo()
      });
    },
    onStateChanged: function onStateChanged() {
      postMessage({
        type: 'onStateChanged',
        machine: (0, _sanitize2.default)(this),
        meta: getMetaInfo()
      });
    },
    onGeneratorStep: function onGeneratorStep(yielded) {
      postMessage({
        type: 'onGeneratorStep',
        yielded: formatYielded(yielded),
        meta: getMetaInfo()
      });
    },
    onGeneratorEnd: function onGeneratorEnd(value) {
      postMessage({
        type: 'onGeneratorEnd',
        value: (0, _sanitize2.default)(value),
        meta: getMetaInfo()
      });
    },
    onGeneratorResumed: function onGeneratorResumed(value) {
      postMessage({
        type: 'onGeneratorResumed',
        value: (0, _sanitize2.default)(value),
        meta: getMetaInfo()
      });
    },
    onMachineConnected: function onMachineConnected(machines, meta) {
      postMessage({
        type: 'onMachineConnected',
        meta: getMetaInfo(_extends({}, meta, { machines: (0, _sanitize2.default)(machines) }))
      });
    },
    onMachineDisconnected: function onMachineDisconnected(machines, meta) {
      postMessage({
        type: 'onMachineDisconnected',
        meta: getMetaInfo(_extends({}, meta, { machines: (0, _sanitize2.default)(machines) }))
      });
    },
    onMiddlewareRegister: function onMiddlewareRegister() {}
  };
};

exports.default = StentEmitter;
module.exports = exports['default'];
},{"./helpers/createMessenger":9,"./helpers/sanitize":10}],9:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createMessenger;
/* eslint-disable vars-on-top */
var PORT = exports.PORT = 8228;
var KUKER_EVENT = 'kuker-event';
var NODE_ORIGIN = 'node (PORT: ' + PORT + ')';

var isDefined = function isDefined(what) {
  return typeof what !== 'undefined';
};

function getOrigin() {
  if (isDefined(location) && isDefined(location.protocol) && isDefined(location.host)) {
    return location.protocol + '//' + location.host;
  }
  return 'unknown';
}

var messagesBeforeSetup = [];
var connections = null;
var app = null;
var isThereAnySocketServer = function isThereAnySocketServer() {
  return app !== null;
};
var isTheServerReady = false;

function createMessenger(emitterName) {
  var emitterDescription = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';


  function enhanceEvent(origin, data) {
    return _extends({
      kuker: true,
      time: new Date().getTime(),
      origin: origin,
      emitter: emitterName
    }, data);
  }
  var socketPostMessage = function socketPostMessage(data) {
    if (isThereAnySocketServer() && connections !== null) {
      Object.keys(connections).forEach(function (id) {
        return connections[id].emit(KUKER_EVENT, [enhanceEvent(NODE_ORIGIN, data)]);
      });
    } else {
      messagesBeforeSetup.push(data);
    }
  };
  var browserPostMessage = function browserPostMessage(data) {
    window.postMessage(enhanceEvent(getOrigin(), data), '*');
  };

  // in node
  if (typeof window === 'undefined') {
    if (isThereAnySocketServer()) {
      socketPostMessage({ type: 'NEW_EMITTER', emitterDescription: emitterDescription });
    } else {
      if (isTheServerReady) {
        return socketPostMessage;
      }
      var r = 'require';
      var socketIO = module[r]('socket.io');
      var http = module[r]('http');

      app = http.createServer(function (req, res) {
        res.writeHead(200);
        res.end('Kuker: Hi!');
      });
      var io = socketIO(app);

      io.on('connection', function (socket) {
        if (connections === null) connections = {};
        connections[socket.id] = socket;
        socket.on('disconnect', function (reason) {
          delete connections[socket.id];
        });
        // the very first client receives the pending messages
        // for the rest ... sorry :)
        if (messagesBeforeSetup.length > 0) {
          socketPostMessage({ type: 'NEW_EMITTER', emitterDescription: emitterDescription });
          messagesBeforeSetup.forEach(function (data) {
            return socketPostMessage(data);
          });
          messagesBeforeSetup = [];
        }
        console.log('Kuker(Messenger): client connected (' + Object.keys(connections).length + ' in total)');
      });

      app.listen(PORT);
      isTheServerReady = true;
      console.log('Kuker(Messenger): server running at ' + PORT);
    }

    return socketPostMessage;
  }

  // in the browser
  browserPostMessage({ type: 'NEW_EMITTER', emitterDescription: emitterDescription });
  return browserPostMessage;
};
},{}],10:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.default = sanitize;

var _CircularJSON = require('./vendors/CircularJSON');

var _SerializeError = require('./vendors/SerializeError');

var _SerializeError2 = _interopRequireDefault(_SerializeError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sanitize(something) {
  var showErrorInConsole = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var result;

  try {
    result = JSON.parse((0, _CircularJSON.stringify)(something, function (key, value) {
      if (typeof value === 'function') {
        return { __func: value.name === '' ? '<anonymous>' : value.name };
      }
      if (value instanceof Error) {
        return (0, _SerializeError2.default)(value);
      }
      return value;
    }));
  } catch (error) {
    if (showErrorInConsole) {
      console.log(error);
    }
    result = null;
  }
  return result;
}
module.exports = exports['default'];
},{"./vendors/CircularJSON":11,"./vendors/SerializeError":12}],11:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
Copyright (C) 2013-2017 by Andrea Giammarchi - @WebReflection

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
var
// should be a not so common char
// possibly one JSON does not encode
// possibly one encodeURIComponent does not encode
// right now this char is '~' but this might change in the future
specialChar = '~',
    safeSpecialChar = '\\x' + ('0' + specialChar.charCodeAt(0).toString(16)).slice(-2),
    escapedSafeSpecialChar = '\\' + safeSpecialChar,
    specialCharRG = new RegExp(safeSpecialChar, 'g'),
    safeSpecialCharRG = new RegExp(escapedSafeSpecialChar, 'g'),
    safeStartWithSpecialCharRG = new RegExp('(?:^|([^\\\\]))' + escapedSafeSpecialChar),
    indexOf = [].indexOf || function (v) {
  for (var i = this.length; i-- && this[i] !== v;) {}
  return i;
},
    $String = String // there's no way to drop warnings in JSHint
// about new String ... well, I need that here!
// faked, and happy linter!
;

function generateReplacer(value, replacer, resolve) {
  var inspect = !!replacer,
      path = [],
      all = [value],
      seen = [value],
      mapp = [resolve ? specialChar : '[Circular]'],
      last = value,
      lvl = 1,
      i,
      fn;
  if (inspect) {
    fn = (typeof replacer === 'undefined' ? 'undefined' : _typeof(replacer)) === 'object' ? function (key, value) {
      return key !== '' && replacer.indexOf(key) < 0 ? void 0 : value;
    } : replacer;
  }
  return function (key, value) {
    // the replacer has rights to decide
    // if a new object should be returned
    // or if there's some key to drop
    // let's call it here rather than "too late"
    if (inspect) value = fn.call(this, key, value);

    // did you know ? Safari passes keys as integers for arrays
    // which means if (key) when key === 0 won't pass the check
    if (key !== '') {
      if (last !== this) {
        i = lvl - indexOf.call(all, this) - 1;
        lvl -= i;
        all.splice(lvl, all.length);
        path.splice(lvl - 1, path.length);
        last = this;
      }
      // console.log(lvl, key, path);
      if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value) {
        // if object isn't referring to parent object, add to the
        // object path stack. Otherwise it is already there.
        if (indexOf.call(all, value) < 0) {
          all.push(last = value);
        }
        lvl = all.length;
        i = indexOf.call(seen, value);
        if (i < 0) {
          i = seen.push(value) - 1;
          if (resolve) {
            // key cannot contain specialChar but could be not a string
            path.push(('' + key).replace(specialCharRG, safeSpecialChar));
            mapp[i] = specialChar + path.join(specialChar);
          } else {
            mapp[i] = mapp[0];
          }
        } else {
          value = mapp[i];
        }
      } else {
        if (typeof value === 'string' && resolve) {
          // ensure no special char involved on deserialization
          // in this case only first char is important
          // no need to replace all value (better performance)
          value = value.replace(safeSpecialChar, escapedSafeSpecialChar).replace(specialChar, safeSpecialChar);
        }
      }
    }
    return value;
  };
}

function retrieveFromPath(current, keys) {
  for (var i = 0, length = keys.length; i < length; current = current[
  // keys should be normalized back here
  keys[i++].replace(safeSpecialCharRG, specialChar)]) {}
  return current;
}

function generateReviver(reviver) {
  return function (key, value) {
    var isString = typeof value === 'string';
    if (isString && value.charAt(0) === specialChar) {
      return new $String(value.slice(1));
    }
    if (key === '') value = regenerate(value, value, {});
    // again, only one needed, do not use the RegExp for this replacement
    // only keys need the RegExp
    if (isString) value = value.replace(safeStartWithSpecialCharRG, '$1' + specialChar).replace(escapedSafeSpecialChar, safeSpecialChar);
    return reviver ? reviver.call(this, key, value) : value;
  };
}

function regenerateArray(root, current, retrieve) {
  for (var i = 0, length = current.length; i < length; i++) {
    current[i] = regenerate(root, current[i], retrieve);
  }
  return current;
}

function regenerateObject(root, current, retrieve) {
  for (var key in current) {
    if (current.hasOwnProperty(key)) {
      current[key] = regenerate(root, current[key], retrieve);
    }
  }
  return current;
}

function regenerate(root, current, retrieve) {
  return current instanceof Array ?
  // fast Array reconstruction
  regenerateArray(root, current, retrieve) : current instanceof $String ?
  // root is an empty string
  current.length ? retrieve.hasOwnProperty(current) ? retrieve[current] : retrieve[current] = retrieveFromPath(root, current.split(specialChar)) : root : current instanceof Object ?
  // dedicated Object parser
  regenerateObject(root, current, retrieve) :
  // value as it is
  current;
}

function stringifyRecursion(value, replacer, space, doNotResolve) {
  return JSON.stringify(value, generateReplacer(value, replacer, !doNotResolve), space);
}

function parseRecursion(text, reviver) {
  return JSON.parse(text, generateReviver(reviver));
}

exports.default = {
  stringify: stringifyRecursion,
  parse: parseRecursion
};
module.exports = exports['default'];
},{}],12:[function(require,module,exports){
// Credits: https://github.com/sindresorhus/serialize-error

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function (value) {
	if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
		return destroyCircular(value, []);
	}

	// People sometimes throw things besides Error objects, so…

	if (typeof value === 'function') {
		// JSON.stringify discards functions. We do too, unless a function is thrown directly.
		return '[Function: ' + (value.name || 'anonymous') + ']';
	}

	return value;
};

// https://www.npmjs.com/package/destroy-circular
function destroyCircular(from, seen) {
	var to = Array.isArray(from) ? [] : {};

	seen.push(from);

	for (var _iterator = Object.keys(from), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
		var _ref;

		if (_isArray) {
			if (_i >= _iterator.length) break;
			_ref = _iterator[_i++];
		} else {
			_i = _iterator.next();
			if (_i.done) break;
			_ref = _i.value;
		}

		var key = _ref;

		var value = from[key];

		if (typeof value === 'function') {
			continue;
		}

		if (!value || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
			to[key] = value;
			continue;
		}

		if (seen.indexOf(from[key]) === -1) {
			to[key] = destroyCircular(from[key], seen.slice(0));
			continue;
		}

		to[key] = '[Circular]';
	}

	if (typeof from.name === 'string') {
		to.name = from.name;
	}

	if (typeof from.message === 'string') {
		to.message = from.message;
	}

	if (typeof from.stack === 'string') {
		to.stack = from.stack;
	}

	return to;
}
},{}],13:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _BaseEmitter = require('./BaseEmitter');

var _BaseEmitter2 = _interopRequireDefault(_BaseEmitter);

var _MachinaEmitter = require('./MachinaEmitter');

var _MachinaEmitter2 = _interopRequireDefault(_MachinaEmitter);

var _ReduxEmitter = require('./ReduxEmitter');

var _ReduxEmitter2 = _interopRequireDefault(_ReduxEmitter);

var _ReduxSagaEmitter = require('./ReduxSagaEmitter');

var _ReduxSagaEmitter2 = _interopRequireDefault(_ReduxSagaEmitter);

var _StentEmitter = require('./StentEmitter');

var _StentEmitter2 = _interopRequireDefault(_StentEmitter);

var _MobXEmitter = require('./MobXEmitter');

var _MobXEmitter2 = _interopRequireDefault(_MobXEmitter);

var _ReactEmitter = require('./ReactEmitter');

var _ReactEmitter2 = _interopRequireDefault(_ReactEmitter);

var _createMessenger = require('./helpers/createMessenger');

var _createMessenger2 = _interopRequireDefault(_createMessenger);

var _sanitize = require('./helpers/sanitize');

var _sanitize2 = _interopRequireDefault(_sanitize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  BaseEmitter: _BaseEmitter2.default,
  MachinaEmitter: _MachinaEmitter2.default,
  ReduxEmitter: _ReduxEmitter2.default,
  ReduxSagaEmitter: _ReduxSagaEmitter2.default,
  StentEmitter: _StentEmitter2.default,
  MobXEmitter: _MobXEmitter2.default,
  ReactEmitter: _ReactEmitter2.default,

  createMessenger: _createMessenger2.default,
  sanitize: _sanitize2.default
};
module.exports = exports['default'];
},{"./BaseEmitter":2,"./MachinaEmitter":3,"./MobXEmitter":4,"./ReactEmitter":5,"./ReduxEmitter":6,"./ReduxSagaEmitter":7,"./StentEmitter":8,"./helpers/createMessenger":9,"./helpers/sanitize":10}],14:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":15}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initEventsBackend = initEventsBackend;

var _util = require('../util');

var _index = require('./index');

var internalRE = /^(?:pre-)?hook:/;

function initEventsBackend(Vue, bridge) {
  var recording = true;

  bridge.on('events:toggle-recording', function (enabled) {
    recording = enabled;
  });

  function logEvent(vm, type, eventName, payload) {
    // The string check is important for compat with 1.x where the first
    // argument may be an object instead of a string.
    // this also ensures the event is only logged for direct $emit (source)
    // instead of by $dispatch/$broadcast
    if (typeof eventName === 'string' && !internalRE.test(eventName)) {
      bridge.send('event:triggered', (0, _util.stringify)({
        eventName: eventName,
        type: type,
        payload: payload,
        instanceId: vm._uid,
        instanceName: (0, _index.getInstanceName)(vm._self || vm),
        timestamp: Date.now()
      }));
    }
  }

  function wrap(method) {
    var original = Vue.prototype[method];
    if (original) {
      Vue.prototype[method] = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var res = original.apply(this, args);
        if (recording) {
          logEvent(this, method, args[0], args.slice(1));
        }
        return res;
      };
    }
  }

  wrap('$emit');
  wrap('$broadcast');
  wrap('$dispatch');
}

},{"../util":21,"./index":19}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.highlight = highlight;
exports.unHighlight = unHighlight;
exports.getInstanceRect = getInstanceRect;

var _util = require('../util');

var overlay = document.createElement('div');
overlay.style.backgroundColor = 'rgba(104, 182, 255, 0.35)';
overlay.style.position = 'fixed';
overlay.style.zIndex = '99999999999999';
overlay.style.pointerEvents = 'none';

/**
 * Highlight an instance.
 *
 * @param {Vue} instance
 */

function highlight(instance) {
  if (!instance) return;
  var rect = getInstanceRect(instance);
  if (rect) {
    showOverlay(rect);
  }
}

/**
 * Remove highlight overlay.
 */

function unHighlight() {
  if (overlay.parentNode) {
    document.body.removeChild(overlay);
  }
}

/**
 * Get the client rect for an instance.
 *
 * @param {Vue} instance
 * @return {Object}
 */

function getInstanceRect(instance) {
  if (!(0, _util.inDoc)(instance.$el)) {
    return;
  }
  if (instance._isFragment) {
    return getFragmentRect(instance);
  } else if (instance.$el.nodeType === 1) {
    return instance.$el.getBoundingClientRect();
  }
}

/**
 * Highlight a fragment instance.
 * Loop over its node range and determine its bounding box.
 *
 * @param {Vue} instance
 * @return {Object}
 */

function getFragmentRect(_ref) {
  var _fragmentStart = _ref._fragmentStart,
      _fragmentEnd = _ref._fragmentEnd;

  var top = void 0,
      bottom = void 0,
      left = void 0,
      right = void 0;
  util().mapNodeRange(_fragmentStart, _fragmentEnd, function (node) {
    var rect = void 0;
    if (node.nodeType === 1 || node.getBoundingClientRect) {
      rect = node.getBoundingClientRect();
    } else if (node.nodeType === 3 && node.data.trim()) {
      rect = getTextRect(node);
    }
    if (rect) {
      if (!top || rect.top < top) {
        top = rect.top;
      }
      if (!bottom || rect.bottom > bottom) {
        bottom = rect.bottom;
      }
      if (!left || rect.left < left) {
        left = rect.left;
      }
      if (!right || rect.right > right) {
        right = rect.right;
      }
    }
  });
  return {
    top: top,
    left: left,
    width: right - left,
    height: bottom - top
  };
}

/**
 * Get the bounding rect for a text node using a Range.
 *
 * @param {Text} node
 * @return {Rect}
 */

var range = document.createRange();
function getTextRect(node) {
  range.selectNode(node);
  return range.getBoundingClientRect();
}

/**
 * Display the overlay with given rect.
 *
 * @param {Rect}
 */

function showOverlay(_ref2) {
  var _ref2$width = _ref2.width,
      width = _ref2$width === undefined ? 0 : _ref2$width,
      _ref2$height = _ref2.height,
      height = _ref2$height === undefined ? 0 : _ref2$height,
      _ref2$top = _ref2.top,
      top = _ref2$top === undefined ? 0 : _ref2$top,
      _ref2$left = _ref2.left,
      left = _ref2$left === undefined ? 0 : _ref2$left;

  overlay.style.width = ~~width + 'px';
  overlay.style.height = ~~height + 'px';
  overlay.style.top = ~~top + 'px';
  overlay.style.left = ~~left + 'px';
  document.body.appendChild(overlay);
}

/**
 * Get Vue's util
 */

function util() {
  return window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue.util;
}

},{"../util":21}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.installHook = installHook;
// this script is injected into every page.

/**
 * Install the hook on window, which is an event emitter.
 * Note because Chrome content scripts cannot directly modify the window object,
 * we are evaling this function by inserting a script tag. That's why we have
 * to inline the whole event emitter implementation here.
 *
 * @param {Window} window
 */

function installHook(window) {
  var listeners = {};

  var hook = {
    Vue: null,

    on: function on(event, fn) {
      event = '$' + event;(listeners[event] || (listeners[event] = [])).push(fn);
    },
    once: function once(event, fn) {
      event = '$' + event;
      function on() {
        this.off(event, on);
        fn.apply(this, arguments);
      }
      ;(listeners[event] || (listeners[event] = [])).push(on);
    },
    off: function off(event, fn) {
      event = '$' + event;
      if (!arguments.length) {
        listeners = {};
      } else {
        var cbs = listeners[event];
        if (cbs) {
          if (!fn) {
            listeners[event] = null;
          } else {
            for (var i = 0, l = cbs.length; i < l; i++) {
              var cb = cbs[i];
              if (cb === fn || cb.fn === fn) {
                cbs.splice(i, 1);
                break;
              }
            }
          }
        }
      }
    },
    emit: function emit(event) {
      event = '$' + event;
      var cbs = listeners[event];
      if (cbs) {
        var args = [].slice.call(arguments, 1);
        cbs = cbs.slice();
        for (var i = 0, l = cbs.length; i < l; i++) {
          cbs[i].apply(this, args);
        }
      }
    }
  };

  hook.once('init', function (Vue) {
    hook.Vue = Vue;
  });

  hook.once('vuex:init', function (store) {
    hook.store = store;
  });

  Object.defineProperty(window, '__VUE_DEVTOOLS_GLOBAL_HOOK__', {
    get: function get() {
      return hook;
    }
  });
}

},{}],19:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initBackend = initBackend;
exports.getInstanceDetails = getInstanceDetails;
exports.getInstanceName = getInstanceName;

var _highlighter = require('./highlighter');

var _vuex = require('./vuex');

var _events = require('./events');

var _util = require('../util');

var _path2 = require('path');

var _path3 = _interopRequireDefault(_path2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Use a custom basename functions instead of the shimed version
// because it doesn't work on Windows
function basename(filename, ext) {
  return _path3.default.basename(filename.replace(/^[a-zA-Z]:/, '').replace(/\\/g, '/'), ext);
}

// hook should have been injected before this executes.
// This is the backend that is injected into the page that a Vue app lives in
// when the Vue Devtools panel is activated.

var hook = window.__VUE_DEVTOOLS_GLOBAL_HOOK__;
var rootInstances = [];
var propModes = ['default', 'sync', 'once'];

var instanceMap = window.__VUE_DEVTOOLS_INSTANCE_MAP__ = new Map();
var consoleBoundInstances = Array(5);
var currentInspectedId = void 0;
var bridge = void 0;
var filter = '';
var captureCount = 0;
var isLegacy = false;
var rootUID = 0;

function initBackend(_bridge) {
  bridge = _bridge;
  if (hook.Vue) {
    isLegacy = hook.Vue.version && hook.Vue.version.split('.')[0] === '1';
    connect();
  } else {
    hook.once('init', connect);
  }
}

function connect() {
  hook.currentTab = 'components';
  bridge.on('switch-tab', function (tab) {
    hook.currentTab = tab;
    if (tab === 'components') {
      flush();
    }
  });

  // the backend may get injected to the same page multiple times
  // if the user closes and reopens the devtools.
  // make sure there's only one flush listener.
  hook.off('flush');
  hook.on('flush', function () {
    if (hook.currentTab === 'components') {
      flush();
    }
  });

  bridge.on('select-instance', function (id) {
    currentInspectedId = id;
    var instance = instanceMap.get(id);
    if (instance) {
      scrollIntoView(instance);
      (0, _highlighter.highlight)(instance);
    }
    bindToConsole(instance);
    flush();
    bridge.send('instance-details', (0, _util.stringify)(getInstanceDetails(id)));
  });

  bridge.on('filter-instances', function (_filter) {
    filter = _filter.toLowerCase();
    flush();
  });

  bridge.on('refresh', scan);
  bridge.on('enter-instance', function (id) {
    return (0, _highlighter.highlight)(instanceMap.get(id));
  });
  bridge.on('leave-instance', _highlighter.unHighlight);

  // vuex
  if (hook.store) {
    (0, _vuex.initVuexBackend)(hook, bridge);
  } else {
    hook.once('vuex:init', function (store) {
      (0, _vuex.initVuexBackend)(hook, bridge);
    });
  }

  // events
  (0, _events.initEventsBackend)(hook.Vue, bridge);

  bridge.log('backend ready.');
  bridge.send('ready', hook.Vue.version);
  console.log('%c vue-devtools %c Detected Vue v' + hook.Vue.version + ' %c', 'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', 'background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff', 'background:transparent');
  scan();
}

/**
 * Scan the page for root level Vue instances.
 */

function scan() {
  rootInstances.length = 0;
  var inFragment = false;
  var currentFragment = null;
  walk(document, function (node) {
    if (inFragment) {
      if (node === currentFragment._fragmentEnd) {
        inFragment = false;
        currentFragment = null;
      }
      return true;
    }
    var instance = node.__vue__;
    if (instance) {
      if (instance._isFragment) {
        inFragment = true;
        currentFragment = instance;
      }

      // respect Vue.config.devtools option
      var baseVue = instance.constructor;
      while (baseVue.super) {
        baseVue = baseVue.super;
      }
      if (baseVue.config && baseVue.config.devtools) {
        // give a unique id to root instance so we can
        // 'namespace' its children
        if (typeof instance.__VUE_DEVTOOLS_ROOT_UID__ === 'undefined') {
          instance.__VUE_DEVTOOLS_ROOT_UID__ = ++rootUID;
        }
        rootInstances.push(instance);
      }

      return true;
    }
  });
  flush();
}

/**
 * DOM walk helper
 *
 * @param {NodeList} nodes
 * @param {Function} fn
 */

function walk(node, fn) {
  if (node.childNodes) {
    for (var i = 0, l = node.childNodes.length; i < l; i++) {
      var child = node.childNodes[i];
      var stop = fn(child);
      if (!stop) {
        walk(child, fn);
      }
    }
  }

  // also walk shadow DOM
  if (node.shadowRoot) {
    walk(node.shadowRoot, fn);
  }
}

/**
 * Called on every Vue.js batcher flush cycle.
 * Capture current component tree structure and the state
 * of the current inspected instance (if present) and
 * send it to the devtools.
 */

function flush() {
  var start = void 0;
  if (process.env.NODE_ENV !== 'production') {
    captureCount = 0;
    start = window.performance.now();
  }
  var payload = (0, _util.stringify)({
    inspectedInstance: getInstanceDetails(currentInspectedId),
    instances: findQualifiedChildrenFromList(rootInstances)
  });
  if (process.env.NODE_ENV !== 'production') {
    console.log('[flush] serialized ' + captureCount + ' instances, took ' + (window.performance.now() - start) + 'ms.');
  }
  bridge.send('flush', payload);
}

/**
 * Iterate through an array of instances and flatten it into
 * an array of qualified instances. This is a depth-first
 * traversal - e.g. if an instance is not matched, we will
 * recursively go deeper until a qualified child is found.
 *
 * @param {Array} instances
 * @return {Array}
 */

function findQualifiedChildrenFromList(instances) {
  instances = instances.filter(function (child) {
    return !child._isBeingDestroyed;
  });
  return !filter ? instances.map(capture) : Array.prototype.concat.apply([], instances.map(findQualifiedChildren));
}

/**
 * Find qualified children from a single instance.
 * If the instance itself is qualified, just return itself.
 * This is ok because [].concat works in both cases.
 *
 * @param {Vue} instance
 * @return {Vue|Array}
 */

function findQualifiedChildren(instance) {
  return isQualified(instance) ? capture(instance) : findQualifiedChildrenFromList(instance.$children);
}

/**
 * Check if an instance is qualified.
 *
 * @param {Vue} instance
 * @return {Boolean}
 */

function isQualified(instance) {
  var name = getInstanceName(instance).toLowerCase();
  return name.indexOf(filter) > -1;
}

/**
 * Capture the meta information of an instance. (recursive)
 *
 * @param {Vue} instance
 * @return {Object}
 */

function capture(instance, _, list) {
  if (process.env.NODE_ENV !== 'production') {
    captureCount++;
  }
  // instance._uid is not reliable in devtools as there
  // may be 2 roots with same _uid which causes unexpected
  // behaviour
  instance.__VUE_DEVTOOLS_UID__ = getUniqueId(instance);
  mark(instance);
  var ret = {
    id: instance.__VUE_DEVTOOLS_UID__,
    name: getInstanceName(instance),
    inactive: !!instance._inactive,
    isFragment: !!instance._isFragment,
    children: instance.$children.filter(function (child) {
      return !child._isBeingDestroyed;
    }).map(capture)
    // record screen position to ensure correct ordering
  };if ((!list || list.length > 1) && !instance._inactive) {
    var rect = (0, _highlighter.getInstanceRect)(instance);
    ret.top = rect ? rect.top : Infinity;
  } else {
    ret.top = Infinity;
  }
  // check if instance is available in console
  var consoleId = consoleBoundInstances.indexOf(instance.__VUE_DEVTOOLS_UID__);
  ret.consoleId = consoleId > -1 ? '$vm' + consoleId : null;
  // check router view
  var isRouterView2 = instance.$vnode && instance.$vnode.data.routerView;
  if (instance._routerView || isRouterView2) {
    ret.isRouterView = true;
    if (!instance._inactive && instance.$route) {
      var matched = instance.$route.matched;
      var depth = isRouterView2 ? instance.$vnode.data.routerViewDepth : instance._routerView.depth;
      ret.matchedRouteSegment = matched && matched[depth] && (isRouterView2 ? matched[depth].path : matched[depth].handler.path);
    }
  }
  return ret;
}

/**
 * Mark an instance as captured and store it in the instance map.
 *
 * @param {Vue} instance
 */

function mark(instance) {
  if (!instanceMap.has(instance.__VUE_DEVTOOLS_UID__)) {
    instanceMap.set(instance.__VUE_DEVTOOLS_UID__, instance);
    instance.$on('hook:beforeDestroy', function () {
      instanceMap.delete(instance.__VUE_DEVTOOLS_UID__);
    });
  }
}

/**
 * Get the detailed information of an inspected instance.
 *
 * @param {Number} id
 */

function getInstanceDetails(id) {
  var instance = instanceMap.get(id);
  if (!instance) {
    return {};
  } else {
    return {
      id: id,
      name: getInstanceName(instance),
      state: processProps(instance).concat(processState(instance), processComputed(instance), processRouteContext(instance), processVuexGetters(instance), processFirebaseBindings(instance), processObservables(instance))
    };
  }
}

/**
 * Get the appropriate display name for an instance.
 *
 * @param {Vue} instance
 * @return {String}
 */

function getInstanceName(instance) {
  var name = instance.$options.name || instance.$options._componentTag;
  if (name) {
    return (0, _util.classify)(name);
  }
  var file = instance.$options.__file; // injected by vue-loader
  if (file) {
    return (0, _util.classify)(basename(file, '.vue'));
  }
  return instance.$root === instance ? 'Root' : 'Anonymous Component';
}

/**
 * Process the props of an instance.
 * Make sure return a plain object because window.postMessage()
 * will throw an Error if the passed object contains Functions.
 *
 * @param {Vue} instance
 * @return {Array}
 */

function processProps(instance) {
  var props = void 0;
  if (isLegacy && (props = instance._props)) {
    // 1.x
    return Object.keys(props).map(function (key) {
      var prop = props[key];
      var options = prop.options;
      return {
        type: 'props',
        key: prop.path,
        value: instance[prop.path],
        meta: {
          type: options.type ? getPropType(options.type) : 'any',
          required: !!options.required,
          mode: propModes[prop.mode]
        }
      };
    });
  } else if (props = instance.$options.props) {
    // 2.0
    var propsData = [];
    for (var key in props) {
      var prop = props[key];
      key = (0, _util.camelize)(key);
      propsData.push({
        type: 'props',
        key: key,
        value: instance[key],
        meta: {
          type: prop.type ? getPropType(prop.type) : 'any',
          required: !!prop.required
        }
      });
    }
    return propsData;
  } else {
    return [];
  }
}

/**
 * Convert prop type constructor to string.
 *
 * @param {Function} fn
 */

var fnTypeRE = /^(?:function|class) (\w+)/;
function getPropType(type) {
  var match = type.toString().match(fnTypeRE);
  return typeof type === 'function' ? match && match[1] || 'any' : 'any';
}

/**
 * Process state, filtering out props and "clean" the result
 * with a JSON dance. This removes functions which can cause
 * errors during structured clone used by window.postMessage.
 *
 * @param {Vue} instance
 * @return {Array}
 */

function processState(instance) {
  var props = isLegacy ? instance._props : instance.$options.props;
  var getters = instance.$options.vuex && instance.$options.vuex.getters;
  return Object.keys(instance._data).filter(function (key) {
    return !(props && key in props) && !(getters && key in getters);
  }).map(function (key) {
    return {
      key: key,
      value: instance._data[key]
    };
  });
}

/**
 * Process the computed properties of an instance.
 *
 * @param {Vue} instance
 * @return {Array}
 */

function processComputed(instance) {
  var computed = [];
  var defs = instance.$options.computed || {};
  // use for...in here because if 'computed' is not defined
  // on component, computed properties will be placed in prototype
  // and Object.keys does not include
  // properties from object's prototype
  for (var key in defs) {
    var def = defs[key];
    var type = typeof def === 'function' && def.vuex ? 'vuex bindings' : 'computed';
    // use try ... catch here because some computed properties may
    // throw error during its evaluation
    var computedProp = null;
    try {
      computedProp = {
        type: type,
        key: key,
        value: instance[key]
      };
    } catch (e) {
      computedProp = {
        type: type,
        key: key,
        value: '(error during evaluation)'
      };
    }

    computed.push(computedProp);
  }

  return computed;
}

/**
 * Process possible vue-router $route context
 *
 * @param {Vue} instance
 * @return {Array}
 */

function processRouteContext(instance) {
  var route = instance.$route;
  if (route) {
    var _path = route.path,
        query = route.query,
        params = route.params;

    var value = { path: _path, query: query, params: params };
    if (route.fullPath) value.fullPath = route.fullPath;
    if (route.hash) value.hash = route.hash;
    if (route.name) value.name = route.name;
    if (route.meta) value.meta = route.meta;
    return [{
      key: '$route',
      value: value
    }];
  } else {
    return [];
  }
}

/**
 * Process Vuex getters.
 *
 * @param {Vue} instance
 * @return {Array}
 */

function processVuexGetters(instance) {
  var getters = instance.$options.vuex && instance.$options.vuex.getters;
  if (getters) {
    return Object.keys(getters).map(function (key) {
      return {
        type: 'vuex getters',
        key: key,
        value: instance[key]
      };
    });
  } else {
    return [];
  }
}

/**
 * Process Firebase bindings.
 *
 * @param {Vue} instance
 * @return {Array}
 */

function processFirebaseBindings(instance) {
  var refs = instance.$firebaseRefs;
  if (refs) {
    return Object.keys(refs).map(function (key) {
      return {
        type: 'firebase bindings',
        key: key,
        value: instance[key]
      };
    });
  } else {
    return [];
  }
}

/**
 * Process vue-rx observable bindings.
 *
 * @param {Vue} instance
 * @return {Array}
 */

function processObservables(instance) {
  var obs = instance.$observables;
  if (obs) {
    return Object.keys(obs).map(function (key) {
      return {
        type: 'observables',
        key: key,
        value: instance[key]
      };
    });
  } else {
    return [];
  }
}

/**
 * Sroll a node into view.
 *
 * @param {Vue} instance
 */

function scrollIntoView(instance) {
  var rect = (0, _highlighter.getInstanceRect)(instance);
  if (rect) {
    window.scrollBy(0, rect.top);
  }
}

/**
 * Binds given instance in console as $vm0.
 * For compatibility reasons it also binds it as $vm.
 *
 * @param {Vue} instance
 */

function bindToConsole(instance) {
  var id = instance.__VUE_DEVTOOLS_UID__;
  var index = consoleBoundInstances.indexOf(id);
  if (index > -1) {
    consoleBoundInstances.splice(index, 1);
  } else {
    consoleBoundInstances.pop();
  }
  consoleBoundInstances.unshift(id);
  for (var i = 0; i < 5; i++) {
    window['$vm' + i] = instanceMap.get(consoleBoundInstances[i]);
  }
  window.$vm = instance;
}

/**
 * Returns a devtools unique id for instance.
 * @param {Vue} instance
 */
function getUniqueId(instance) {
  var rootVueId = instance.$root.__VUE_DEVTOOLS_ROOT_UID__;
  return rootVueId + ':' + instance._uid;
}

}).call(this,require('_process'))
},{"../util":21,"./events":16,"./highlighter":17,"./vuex":20,"_process":15,"path":14}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initVuexBackend = initVuexBackend;

var _util = require('src/util');

function initVuexBackend(hook, bridge) {
  var store = hook.store;
  var recording = true;

  var getSnapshot = function getSnapshot() {
    return (0, _util.stringify)({
      state: store.state,
      getters: store.getters
    });
  };

  bridge.send('vuex:init', getSnapshot());

  // deal with multiple backend injections
  hook.off('vuex:mutation');

  // application -> devtool
  hook.on('vuex:mutation', function (mutation) {
    if (!recording) return;
    bridge.send('vuex:mutation', {
      mutation: {
        type: mutation.type,
        payload: (0, _util.stringify)(mutation.payload)
      },
      timestamp: Date.now(),
      snapshot: getSnapshot()
    });
  });

  // devtool -> application
  bridge.on('vuex:travel-to-state', function (state) {
    hook.emit('vuex:travel-to-state', state);
  });

  bridge.on('vuex:import-state', function (state) {
    hook.emit('vuex:travel-to-state', state);
    bridge.send('vuex:init', getSnapshot());
  });

  bridge.on('vuex:toggle-recording', function (enabled) {
    recording = enabled;
  });
}

},{"src/util":21}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NAN = exports.INFINITY = exports.UNDEFINED = exports.camelize = exports.classify = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.inDoc = inDoc;
exports.stringify = stringify;
exports.parse = parse;
exports.isPlainObject = isPlainObject;
exports.searchDeepInObject = searchDeepInObject;
exports.sortByKey = sortByKey;

var _circularJsonEs = require('circular-json-es6');

var _circularJsonEs2 = _interopRequireDefault(_circularJsonEs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

var classifyRE = /(?:^|[-_/])(\w)/g;
var classify = exports.classify = cached(function (str) {
  return str.replace(classifyRE, toUpper);
});

var camelizeRE = /-(\w)/g;
var camelize = exports.camelize = cached(function (str) {
  return str.replace(camelizeRE, toUpper);
});

function toUpper(_, c) {
  return c ? c.toUpperCase() : '';
}

function inDoc(node) {
  if (!node) return false;
  var doc = node.ownerDocument.documentElement;
  var parent = node.parentNode;
  return doc === node || doc === parent || !!(parent && parent.nodeType === 1 && doc.contains(parent));
}

/**
 * Stringify/parse data using CircularJSON.
 */

var UNDEFINED = exports.UNDEFINED = '__vue_devtool_undefined__';
var INFINITY = exports.INFINITY = '__vue_devtool_infinity__';
var NAN = exports.NAN = '__vue_devtool_nan__';

function stringify(data) {
  return _circularJsonEs2.default.stringify(data, replacer);
}

function replacer(key, val) {
  if (val === undefined) {
    return UNDEFINED;
  } else if (val === Infinity) {
    return INFINITY;
  } else if (Number.isNaN(val)) {
    return NAN;
  } else if (val instanceof RegExp) {
    // special handling of native type
    return '[native RegExp ' + val.toString() + ']';
  } else {
    return sanitize(val);
  }
}

function parse(data, revive) {
  return revive ? _circularJsonEs2.default.parse(data, reviver) : _circularJsonEs2.default.parse(data);
}

function reviver(key, val) {
  if (val === UNDEFINED) {
    return undefined;
  } else if (val === INFINITY) {
    return Infinity;
  } else if (val === NAN) {
    return NaN;
  } else {
    return val;
  }
}

/**
 * Sanitize data to be posted to the other side.
 * Since the message posted is sent with structured clone,
 * we need to filter out any types that might cause an error.
 *
 * @param {*} data
 * @return {*}
 */

function sanitize(data) {
  if (!isPrimitive(data) && !Array.isArray(data) && !isPlainObject(data)) {
    // handle types that will probably cause issues in
    // the structured clone
    return Object.prototype.toString.call(data);
  } else {
    return data;
  }
}

function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

function isPrimitive(data) {
  if (data == null) {
    return true;
  }
  var type = typeof data === 'undefined' ? 'undefined' : _typeof(data);
  return type === 'string' || type === 'number' || type === 'boolean';
}

function searchDeepInObject(obj, searchTerm) {
  var match = false;
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var value = obj[key];
    if (compare(key, searchTerm) || compare(value, searchTerm)) {
      match = true;
      break;
    }
    if (isPlainObject(value)) {
      match = searchDeepInObject(value, searchTerm);
      if (match) {
        break;
      }
    }
  }
  return match;
}

function compare(mixedValue, stringValue) {
  if (Array.isArray(mixedValue) && searchInArray(mixedValue, stringValue.toLowerCase())) {
    return true;
  }
  if (('' + mixedValue).toLowerCase().indexOf(stringValue.toLowerCase()) !== -1) {
    return true;
  }
  return false;
}

function searchInArray(arr, searchTerm) {
  var found = false;
  for (var i = 0; i < arr.length; i++) {
    if (('' + arr[i]).toLowerCase().indexOf(searchTerm) !== -1) {
      found = true;
      break;
    }
  }
  return found;
}

function sortByKey(state) {
  return state && state.slice().sort(function (a, b) {
    if (a.key < b.key) return -1;
    if (a.key > b.key) return 1;
    return 0;
  });
}

},{"circular-json-es6":1}],22:[function(require,module,exports){
'use strict';

var _hook = require('src/backend/hook');

var _kukerEmitters = require('kuker-emitters');

var MAX_MESSAGES_TO_CACHE = 50;
var HOOK_KEY = '__VUE_DEVTOOLS_GLOBAL_HOOK__';
var KUKER_HOOK_KEY = '__KUKER_VUE_HOOK__';
var detectAttempts = 7;

var detect = function detect(callback) {
  detectAttempts -= 1;

  if (window[HOOK_KEY] && !!window[HOOK_KEY].Vue) {
    callback(null, window[HOOK_KEY]);
  } else {
    if (detectAttempts === 0) {
      callback('Can not detect Vue on the page!');
      return;
    }
    setTimeout(function () {
      return detect(callback);
    }, 1000);
  }
};

(0, _hook.installHook)(window);
detect(function (error) {
  if (error) return;

  var listeners = [];
  var bridgeListeners = {};

  var _require = require('src/backend/index'),
      initBackend = _require.initBackend,
      getInstanceDetails = _require.getInstanceDetails;

  var messages = [];
  var defaultInstanceCharacteristics = { data: {}, computed: {}, props: {} };

  window[KUKER_HOOK_KEY] = {
    listen: function listen(callback) {
      listeners.push(callback);
      messages.forEach(function (_ref) {
        var type = _ref.type,
            payload = _ref.payload;
        return callback(type, payload);
      });
    }
  };

  function populateVueTreeWithInstanceDetails(tree) {
    return function process(node) {
      if (node && node.id) {
        var _getInstanceDetails = getInstanceDetails(node.id),
            name = _getInstanceDetails.name,
            state = _getInstanceDetails.state;

        var _ref2 = state && Array.isArray(state) ? state.reduce(function (result, item) {
          if (item.type === 'computed') {
            result.computed[item.key] = item.value;
          } else if (item.type === 'props') {
            result.props[item.key] = item.value;
          } else {
            result.data[item.key] = item.value;
          }
          return result;
        }, defaultInstanceCharacteristics) : defaultInstanceCharacteristics,
            data = _ref2.data,
            computed = _ref2.computed,
            props = _ref2.props;

        node = Object.assign(node, name && { name: name }, { data: (0, _kukerEmitters.sanitize)(data), computed: (0, _kukerEmitters.sanitize)(computed), props: (0, _kukerEmitters.sanitize)(props) });
      }
      if (node.children && node.children.length > 0) {
        node.children = node.children.map(process);
      }
      return node;
    }({
      name: 'Vue',
      state: {},
      children: tree.instances || []
    });
  }

  initBackend({
    on: function on(type, callback) {
      // we are currently not using these listeners but who knows ...
      if (!bridgeListeners[type]) bridgeListeners[type] = [];
      bridgeListeners[type].push(callback);
    },
    send: function send(type, payload) {
      if (messages.length > MAX_MESSAGES_TO_CACHE) messages.shift();
      if (type === 'flush') {
        try {
          payload = populateVueTreeWithInstanceDetails(JSON.parse(payload));
        } catch (error) {
          console.error('Vue tree can not be deserialized to json.');
          payload = {};
        }
      }
      messages.push({ type: type, payload: payload });
      listeners.forEach(function (l) {
        return l(type, payload);
      });
    },
    log: function log() {}
  });
});

},{"kuker-emitters":13,"src/backend/hook":18,"src/backend/index":19}]},{},[22]);
