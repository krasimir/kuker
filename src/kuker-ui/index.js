import React from 'react';
import ReactDOM from 'react-dom';
import bridge from './services/bridge';
import App from './components/App.jsx';
import devToolsMachine from './stent/DevTools';
import './stent/TreeNav';
import './stent/Pinned';

bridge.on(action => devToolsMachine.actionReceived(action));

ReactDOM.render(<App />, document.querySelector('#container'));

// shortcuts
Mousetrap.bind('ctrl+`', function (e) {
  console.log(JSON.stringify(devToolsMachine.state, null, 2));
});

// development goodies
if (typeof window !== 'undefined' && window.location && window.location.href) {
  if (window.location.href.indexOf('populate=') > 0) {
    let s;

    if (window.location.href.indexOf('populate=stent') > 0) {
      s = '../_mocks/example.stent.json';
    } else if (window.location.href.indexOf('populate=redux') > 0) {
      s = '../_mocks/example.redux.json';
    } else if (window.location.href.indexOf('populate=saga') > 0) {
      s = '../_mocks/example.saga.json';
    } else if (window.location.href.indexOf('populate=mutations') > 0) {
      s = '../_mocks/example.mutations.json';
    } else if (window.location.href.indexOf('populate=ssr') > 0) {
      s = '../_mocks/example.saga.ssr.json';
    } else if (window.location.href.indexOf('populate=mobx') > 0) {
      s = '../_mocks/example.mobx.json';
    } else if (window.location.href.indexOf('populate=react') > 0) {
      s = '../_mocks/example.react.json';
    } else if (window.location.href.indexOf('populate=angular') > 0) {
      s = '../_mocks/example.angular.json';
    }

    fetch(s).then(response => {
      response.json().then(({ events }) => {
        console.log('About to inject ' + events.length + ' actions');
        devToolsMachine.actionReceived(events);
      });
    });
  };
}

// misc
// Machine.addMiddleware(StentEmitter);
