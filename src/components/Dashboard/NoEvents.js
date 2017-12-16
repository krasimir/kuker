/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React from 'react';

function reloadExtension() {
  if (location && location.reload) {
    location.reload();
  }
}

export default function NoEvents() {
  return (
    <div className='noEvents'>
      <img src='./img/kuker.png' />
      <p>Waiting for events...</p>
      <p>
        <small>
          Or maybe there&apos;s nothing wired to your application?<br />
          Learn about Kuker&apos;s emitters <a href='https://github.com/krasimir/kuker#instrumentation' target='_blank' rel='noopener noreferrer'>here</a>.<br /><br />
          Nothing helps? Click <a href='#' onClick={ reloadExtension }>here</a> to refresh the extension.
        </small>
      </p>
    </div>
  );
};

NoEvents.propTypes = {
  healthyComponent: PropTypes.element
};
