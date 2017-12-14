// eslint-disable-next-line no-unused-vars
import React from 'react';
import getMachineName from '../../../helpers/getMachineName';

import calculateRowStyles from './helpers/calculateRowStyles';
// eslint-disable-next-line no-unused-vars
import TimeDiff from '../../TimeDiff';

export default function onMachineDisconnected({ event, onClick, className }) {
  const { state, meta, timeDiff } = event;
  const style = calculateRowStyles(event, { color: 'rgb(170, 189, 207)' });
  const machinesConnectedTo = state.map(getMachineName).join(', ');
  const component = meta.component ? <strong>{ `<${ meta.component }>` }</strong> : null;

  return (
    <li style={ style } onClick={ onClick } className={ className }>
      <TimeDiff timeDiff={ timeDiff } parentStyle={ style } />
      <div className='actionRowContent'>
        <i className='fa fa-unlink'></i>
        { component } disconnected from <strong>{ machinesConnectedTo }</strong>
      </div>
    </li>
  );
}
