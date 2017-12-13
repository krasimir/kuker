/* eslint-disable no-unused-vars, max-len */
import React from 'react';

export default function NoEvents() {
  return (
    <div className='noEvents'>
      <img src='./img/kuker.png' />
      <p>Waiting for events...</p>
      <p><small>Or maybe there's nothing wired to your application?<br />
      Learn about Kuker's emitters <a href="https://github.com/krasimir/kuker#instrumentation" target='_blank'>here</a>.</small></p>
    </div>
  );
};
