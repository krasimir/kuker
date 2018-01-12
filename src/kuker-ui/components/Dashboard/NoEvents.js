/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React from 'react';
import manifest from '../../../extension-static/manifest.json';

// function reloadExtension() {
//   if (location && location.reload) {
//     location.reload();
//   }
// }

export default function NoEvents() {
  return (
    <div className='noEvents'>
      <img src='./img/kuker.png' className='logo'/>
      <div className='balloon'>
        Hey, I&apos;m version { manifest.version } and I&apos;m not broken. Just wait a bit or check my <a href='https://github.com/krasimir/kuker' target='_blank'>official docs</a> to learn how to integrate <a href='https://github.com/krasimir/kuker' target='_blank'>me</a> with your app.<br />
      </div>
    </div>
  );
};

NoEvents.propTypes = {
  healthyComponent: PropTypes.element
};
