import React from 'react';
import ReactDOM from 'react-dom';
import { Machine } from 'stent';
import { PAGES } from './stent/machines';
import { connect } from 'stent/lib/react';
import bridge from './services/bridge';
import App from './components/App.jsx';

const devToolsMachine = Machine.get('DevTools');

bridge.on(action => devToolsMachine.actionReceived(action));

ReactDOM.render(<App />, document.querySelector('#container'));


