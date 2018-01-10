/* eslint-disable no-undef, vars-on-top */
const fs = require('fs');
const vueDevtools = fs.readFileSync(__dirname + '/../vendor/vue.devtools.js', 'utf-8');

const script = document.createElement('script');

script.textContent = vueDevtools.toString();
document.documentElement.appendChild(script);
script.parentNode.removeChild(script);
