# Stent Dev Tools

Chrome extension to monitor state machines created by [Stent](https://github.com/krasimir/stent) library and not only.

### Posting a message to the extension

```js
window.top.postMessage({
  source: 'stent',
  time: (new Date()).getTime(),
  uid: 'foo',
  state: { bank: { money: 0 } },
  label: 'Take my money',
  icon: 'fa-money'
}, '*');
```

*`icon` is one of the FontAwesome icons. Check out [here](http://fontawesome.io/icons/).*
