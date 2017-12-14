// eslint-disable-next-line no-unused-vars
import React from 'react';
import getMachineName from '../../../helpers/getMachineName';

import calculateRowStyles from './helpers/calculateRowStyles';
// eslint-disable-next-line no-unused-vars
import TimeDiff from '../../TimeDiff';

export default function onStateWillChange({ event, onClick, className }) {
  const { machine, timeDiff } = event;
  const style = calculateRowStyles(event, { color: 'rgb(201, 172, 186)' });

  return (
    <li style={ style } onClick={ onClick } className={ className }>
      <TimeDiff timeDiff={ timeDiff } parentStyle={ style } />
      <div className='actionRowContent'>
        <i className='fa fa-heart'></i>
        <strong>{ getMachineName(machine) }</strong>'s state(<strong>{ machine.state.name }</strong>) will change
      </div>
    </li>
  );
}
