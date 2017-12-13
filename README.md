# Kuker

![kuker](./img/kuker_banner.jpg)

Chrome extension to debug your apps.

Install it from here [chrome.google.com/webstore/detail/glgnienmpgmf...](https://chrome.google.com/webstore/detail/glgnienmpgmfpkigngkmieconbnkmlcn).

## Philosophy

If you build software you probably know that debugging what you just wrote is really important. Without seeing how your code works on a lower level you can't say that something is done. Finding and fixing bugs is also important. And without a proper tool it becomes difficult and time consuming. [Kuker](https://chrome.google.com/webstore/detail/glgnienmpgmfpkigngkmieconbnkmlcn) is here to help by improving your workflow.

---

I'm working with React and Redux last years and they seem to have pretty active community. Community that built awesome tools which improve the developer experience. One of these tools is [Redux-DevTools](https://github.com/zalmoxisus/redux-devtools-extension). I got lots of ideas from there and my goal in the beginning was to write (for fun) a clone with a little bit more features. Stuff which I wanted to see. However, later I realized that this may be used out of Redux context and basically support every library or framework. It is just answering of two important questions.

* What is going on in my application? In Redux this is pretty much the actions tha fly around. But in your app this may be events or streams or whatever. It is just a **thing** happening in specific point of time. Think about a timeline with bunch of points inside.
* How my application changes based on actions/events happening in my application? It is all about state right. Seeing how your app state mutates based on actions is priceless. You are able to spot bugs and see what is causing them.

The extension answers on these two questions. We have two panels. The one on the left shows a list of all the actions/events in your application while the one on the right displays the state after each one of them.

![redux saga extension](./img/redux_screenshot_1280x800.jpg)

*(The screenshot is made of the [this Codepen](https://codepen.io/krasimir/pen/vpYrqw))*

## Instrumentation

To make the extension show something you have to *instrument* your application. This happens by adding an [_emitter_](https://github.com/krasimir/kuker-emitters) which listens for actions/events and sends them to [Kuker](https://chrome.google.com/webstore/detail/glgnienmpgmfpkigngkmieconbnkmlcn). Here are the available emitters so far:

* [Redux emitter](https://github.com/krasimir/kuker-emitters#integration-with-redux)
* [redux-saga emitter](https://github.com/krasimir/kuker-emitters#integration-with-redux-saga)
* [Stent emitter](https://github.com/krasimir/kuker-emitters#integration-with-stent)

Of course you don't have to use any of these libraries to enjoy [Kuker](https://chrome.google.com/webstore/detail/glgnienmpgmfpkigngkmieconbnkmlcn). You may send a message on your own using the [`postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) API:

```js
window.top.postMessage({
  type: 'adding money to my account',
  label: 'hello',
  time: (new Date()).getTime(),
  state: { bank: { money: 100 } },
  icon: 'fa-money',
  color: '#bada55'
}, '*');
```

The result of this `postMessage` call is as follows:

![custom event](./img/screenshot_custom_event.jpg)

The only one required property is `type`. You may skip the others if you want. `icon` is one of the [FontAwesome](http://fontawesome.io/icons/) icons.

## Misc

* Inspired by [Redux-DevTools](https://github.com/zalmoxisus/redux-devtools-extension)
