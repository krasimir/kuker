// eslint-disable-next-line no-unused-vars
import PropTypes from 'prop-types';
import React from 'react';
import AngularIcon from '../../icons/AngularIcon';

import calculateRowStyles from './helpers/calculateRowStyles';
// eslint-disable-next-line no-unused-vars
import TimeDiff from '../../TimeDiff';

export default function AngularEvent({ event, onClick, className }) {
  const style = calculateRowStyles(event, { color: 'rgb(230, 230, 230)' });
  var label = event.type;

  switch (event.type) {
    case '@@angular_rootDetected':
      label = 'Root node detected ';
      break;
    case '@@angular_onStable':
      label = 'Update (stable)';
      break;
    case '@@angular_onError':
      label = 'Error';
      break;
    case '@@angular_onMicrotaskEmpty':
      label = 'Update (microtask empty)';
      break;
    case '@@angular_onUnstable':
      label = 'Update (unstable)';
      break;
  }

  return (
    <div style={ style } onClick={ onClick } className={ className }>
      <TimeDiff timeDiff={ event.timeDiff } parentStyle={ style } />
      <div className='actionRowContent'>
        <AngularIcon style={{ float: 'left' }}></AngularIcon>
        { label }
      </div>
    </div>
  );
};

AngularEvent.propTypes = {
  event: PropTypes.object,
  onClick: PropTypes.func,
  className: PropTypes.string
};

AngularEvent.isAngularEvent = (({ type }) => type.split('_')[0] === '@@angular');
