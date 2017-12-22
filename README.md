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

![Kuker](./img/screenshots_instructions.jpg)

*(The screenshot is made of [this Codepen](https://codepen.io/krasimir/pen/vpYrqw))*

## Instrumentation

To make the extension work you have to *instrument* your application. You have to add an [_emitter_](https://github.com/krasimir/kuker-emitters) which listens for actions/events on your side and sends them to [Kuker](https://chrome.google.com/webstore/detail/glgnienmpgmfpkigngkmieconbnkmlcn). Here are some of the ready ones:

* [Base emitter](https://github.com/krasimir/kuker-emitters)
* [Redux emitter](https://github.com/krasimir/kuker-emitters)
* [redux-saga emitter](https://github.com/krasimir/kuker-emitters)
* [Stent emitter](https://github.com/krasimir/kuker-emitters)
* [Machina.js emitter](https://github.com/krasimir/kuker-emitters)
* [MobX emitter](https://github.com/krasimir/kuker-emitters)

## Writing your own Emitter

Of course you don't have to use any of these libraries to enjoy [Kuker](https://chrome.google.com/webstore/detail/glgnienmpgmfpkigngkmieconbnkmlcn). You may send a message on your own using the [`postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) API:

```js
window.postMessage({
  kuker: true,
  type: 'adding money to my account',
  origin: 'something',
  label: 'hello',
  time: (new Date()).getTime(),
  state: { bank: { money: 100 } },
  icon: 'fa-money',
  color: '#bada55'
}, '*');
```

The result of this `postMessage` call is as follows:

![custom event](./img/screenshot_custom_event.jpg)

The only required properties are `type` and `kuker: true`. You may skip the others if you want. `icon` is one of the [FontAwesome](http://fontawesome.io/icons/) icons.

The problem of doing it alone is that you have to take care for a two things:

* Your state may contain stuff which are not easily serializable.
* You have to check if `window.postMessage` is available (does not exist in node environment).

All these three issues are solved by using the [BaseEmitter](https://github.com/krasimir/kuker-emitters#baseemitter). All the predefined emitters at [github.com/krasimir/kuker-emitters](https://github.com/krasimir/kuker-emitters) send events only if the extension is installed. Otherwise they are just dummy functions with no effect.

*I'll be more then happy to see you contributing to [kuker-emitters](https://github.com/krasimir/kuker-emitters). There're also utility functions for calling `postMessage` or the so called `guard` function that protects the emitter calls in production.*

## In production

In the beginning there was a guard in the emitters that makes sure that events are sent only if the extension is installed. However, this technique involves the [content script](https://developer.chrome.com/extensions/content_scripts) of the extension to inject some stuff on the page which was fragile and buggy. I decided to kill that feature until I find a better way to handle it. So, for the time being you have to guard the emitters manually.

## How it works

Once you load the app the integrated emitters start calling `window.postMessage`. The [content script](https://developer.chrome.com/extensions/content_scripts) is listening for this messages and via the `chrome.runtime` API sends them to the DevTools panel. The rest is just a small React app that displays them.

## Misc

* Inspired by [Redux-DevTools](https://github.com/zalmoxisus/redux-devtools-extension)
