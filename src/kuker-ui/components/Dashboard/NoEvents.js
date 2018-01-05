/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React from 'react';
import manifest from '../../../extension-static/manifest.json';

function reloadExtension() {
  if (location && location.reload) {
    location.reload();
  }
}

export default function NoEvents() {
  return (
    <div className='noEvents'>
      <img src='./img/kuker.png' />
      <div className='text'>
        <strong>Waiting for events...</strong>
        <hr />
        Did you forget to instrument your app?<br />
        What&apos;s your framework of choice:
        <br />
        <a href="https://github.com/krasimir/kuker-emitters#integration-with-react" target="_blank" rel='noopener noreferrer'>React</a>, <a href="https://github.com/krasimir/kuker-emitters#integration-with-redux" target="_blank" rel='noopener noreferrer'>Redux</a>, <a href="https://github.com/krasimir/kuker-emitters#integration-with-redux-saga" target="_blank" rel='noopener noreferrer'>redux-saga</a>, <a href="https://github.com/krasimir/kuker-emitters#integration-with-mobx" target="_blank" rel='noopener noreferrer'>MobX</a>, <a href="https://github.com/krasimir/kuker-emitters#integration-with-stent" target="_blank" rel='noopener noreferrer'>Stent</a>, <a href="https://github.com/krasimir/kuker-emitters#integration-with-machinajs" target="_blank" rel='noopener noreferrer'>Machina.js</a>, <a href="https://github.com/krasimir/kuker-emitters#baseemitter" target="_blank" rel='noopener noreferrer'>No framework</a>, <a href="https://github.com/krasimir/kuker-emitters" target="_blank" rel='noopener noreferrer'>Other</a>
        <hr />
        <ul>
          <li>Learn about <a href="https://github.com/krasimir/kuker" target="_blank" rel='noopener noreferrer'>Kuker</a></li>
          <li>Learn about <a href='https://github.com/krasimir/kuker#instrumentation' target='_blank' rel='noopener noreferrer'>Kuker&apos;s emitters</a>.</li>
          <li>Nothing helps? Click <a href='#' onClick={ reloadExtension }>here</a> to refresh the extension.</li>
        </ul>
        <hr />
        <small>v.{ manifest.version }</small>
      </div>
    </div>
  );
};

NoEvents.propTypes = {
  healthyComponent: PropTypes.element
};
