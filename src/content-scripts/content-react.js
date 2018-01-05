/* eslint-disable no-undef, vars-on-top */

const fs = require('fs');
const reactDevToolsConnector = fs.readFileSync(__dirname + '/../vendor/react.devtools.helpers.js', 'utf-8');

// Injecting __REACT_DEVTOOLS_GLOBAL_HOOK__
const script = document.createElement('script');

script.textContent = reactDevToolsConnector.toString();
document.documentElement.appendChild(script);
script.parentNode.removeChild(script);
