import PropTypes from 'prop-types';
import React from 'react';

export default function NoEvents({ healthyComponent }) {
  return (
    <div className='noEvents'>
      <img src='./img/kuker.png' />
      <p>Waiting for events...</p>
      <p><small>Or maybe there's nothing wired to your application?<br />
      Learn about Kuker's emitters <a href='https://github.com/krasimir/kuker#instrumentation' target='_blank'>here</a>.</small></p>
      { healthyComponent }
    </div>
  );
};

NoEvents.propTypes = {
  healthyComponent: PropTypes.element
};
