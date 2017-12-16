import React from 'react';
import ReactDOM from 'react-dom';
import bridge from './services/bridge';
import App from './components/App.jsx';
import devToolsMachine from './stent/DevTools';
import './stent/TreeNav';

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
      s = './mocks/example.stent.json';
    } else if (window.location.href.indexOf('populate=redux') > 0) {
      s = './mocks/example.redux.json';
    } else if (window.location.href.indexOf('populate=saga') > 0) {
      s = './mocks/example.saga.json';
    } else if (window.location.href.indexOf('populate=mutations') > 0) {
      s = './mocks/example.mutations.json';
    }

    fetch(s).then(response => {
      response.json().then(({ events }) => {
        console.log('About to inject ' + events.length + ' actions');
        devToolsMachine.actionReceived(events);
      });
    });
  };
}
