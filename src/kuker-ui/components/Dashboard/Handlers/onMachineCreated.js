// eslint-disable-next-line no-unused-vars
import React from 'react';
import getMachineName from '../../../helpers/getMachineName';

import calculateRowStyles from './helpers/calculateRowStyles';
// eslint-disable-next-line no-unused-vars
import TimeDiff from '../../TimeDiff';

export default function onMachineCreated({ event, timeDiff, onClick, className }) {
  const { machine } = event;
  const style = calculateRowStyles(event, { color: 'rgb(200, 212, 201)' });

  return (
    <div style={ style } onClick={ onClick } className={ className }>
      <TimeDiff timeDiff={ timeDiff } parentStyle={ style } />
      <div className='actionRowContent'>
        <i className='fa fa-plus'></i>
        <strong>{ getMachineName(machine) }</strong> machine created
      </div>
    </div>
  );
};
