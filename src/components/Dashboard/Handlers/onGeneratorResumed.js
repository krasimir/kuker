// eslint-disable-next-line no-unused-vars
import React from 'react';
// eslint-disable-next-line no-unused-vars
import getMachineName from '../../../helpers/getMachineName';
import shortenJSON from '../../../helpers/shortenJSON';

import calculateRowStyles from './helpers/calculateRowStyles';
// eslint-disable-next-line no-unused-vars
import TimeDiff from '../../TimeDiff';

export default function onGeneratorResumed({ event, onClick, className }) {
  const { value, timeDiff } = event;
  const style = calculateRowStyles(event, { color: 'rgb(201, 202, 189)' });
  const short = value ? `with ${ shortenJSON(value) }` : '';

  return (
    <div style={ style } onClick={ onClick } className={ className }>
      <TimeDiff timeDiff={ timeDiff } parentStyle={ style } />
      <div className='actionRowContent'>
        <i className='fa fa-arrow-circle-right'></i>
        generator <strong>resumed</strong> { short }
      </div>
    </div>
  );
}
