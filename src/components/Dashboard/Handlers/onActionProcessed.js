// eslint-disable-next-line no-unused-vars
import React from 'react';
import getMachineName from '../../../helpers/getMachineName';

import calculateRowStyles from './helpers/calculateRowStyles';
// eslint-disable-next-line no-unused-vars
import TimeDiff from '../../TimeDiff';

export default function onActionProcessed({ event, onClick, className }) {
  const { actionName, machine, timeDiff } = event;
  const style = calculateRowStyles(event, { color: 'rgb(192, 189, 202)' });

  return (
    <div style={ style } onClick={ onClick } className={ className }>
      <TimeDiff timeDiff={ timeDiff } parentStyle={ style } />
      <div className='actionRowContent'>
        <i className='fa fa-thumbs-o-up'></i>
        <strong>{ actionName }</strong>
        <i className='fa fa-long-arrow-right' style={{ marginRight: '0.5em', marginLeft: '0.5em' }}></i>
        <strong>{ getMachineName(machine) }</strong>
      </div>
    </div>
  );
}
