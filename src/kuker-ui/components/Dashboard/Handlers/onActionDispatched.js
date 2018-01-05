import React from 'react';
import PropTypes from 'prop-types';
import getMachineName from '../../../helpers/getMachineName';

import calculateRowStyles from './helpers/calculateRowStyles';
import TimeDiff from '../../TimeDiff';

export default function onActionDispatched({ event, timeDiff, onClick, className }) {
  const { actionName, machine } = event;
  const style = calculateRowStyles(event, { color: 'rgb(192, 189, 202)' });

  return (
    <div style={ style } onClick={ onClick } className={ className }>
      <TimeDiff timeDiff={ timeDiff } parentStyle={ style } />
      <div className='actionRowContent'>
        <i className='fa fa-share'></i>
        <strong>{ actionName }</strong>
        <i className='fa fa-long-arrow-right' style={{ marginRight: '0.5em', marginLeft: '0.5em' }}></i>
        <strong>{ getMachineName(machine) }</strong>
      </div>
    </div>
  );
}

onActionDispatched.propTypes = {
  event: PropTypes.object,
  timeDiff: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string
};
