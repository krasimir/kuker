# Kuker

![kuker](./_logo/kuker_banner.jpg)

Chrome extension to debug your apps.

## Philosophy

If you write code you probably know that debugging what you just wrote is really important. Without seeing how your code behaves on a lower level you can't really implement properly. Finding and fixing bugs is also important. And without a proper tool it becomes difficult and time consuming. *Kuker* is here to improve your workflow.

I'm working with React and Redux last years and they seem to have pretty active community. Community that built awesome tools which improve the developer experience to higher levels. One of this tools is [Redux-DevTools](https://github.com/zalmoxisus/redux-devtools-extension). I got lots of ideas from there and my goal in the beginning was to write (for fun) a clone with a little bit more features. Stuff which I wanted to use. However, later I realized that this may be used out of Redux context and basically support every library or framework.

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

## Misc

* Inspired by [Redux-DevTools](https://github.com/zalmoxisus/redux-devtools-extension)
