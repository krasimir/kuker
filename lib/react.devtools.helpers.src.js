/* eslint-disable vars-on-top */
const installGlobalHook = require('../src/vendor/react-devtools/backend/installGlobalHook');
const Backend = require('../src/vendor/react-devtools/backend/backend');
const getData = require('../src/vendor/react-devtools/backend/getData');
const getData012 = require('../src/vendor/react-devtools/backend/getData012');
const getDataFiber = require('../src/vendor/react-devtools/backend/getDataFiber');
const getDisplayName = require('../src/vendor/react-devtools/backend/getDisplayName');

installGlobalHook(window);

var interval = null;
var tries = 10;

(function isReactReady() {
  if (
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ &&
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__._renderers &&
    Object.keys(window.__REACT_DEVTOOLS_GLOBAL_HOOK__._renderers).length > 0
  ) {
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.__helpers = {
      getData, getData012, getDataFiber, getDisplayName
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
