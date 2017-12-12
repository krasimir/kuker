# Kuker

Chrome extension to debug your apps

### Posting a message to the extension

```js
window.top.postMessage({
  time: (new Date()).getTime(),
  state: { bank: { money: 0 } },
  label: 'Take my money',
  icon: 'fa-money'
}, '*');
```

*`icon` is one of the FontAwesome icons. Check out [here](http://fontawesome.io/icons/).*
