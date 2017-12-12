// eslint-disable-next-line no-unused-vars
import React from 'react';
// eslint-disable-next-line no-unused-vars
import SagaEffectName from './helpers/SagaEffectName';
// eslint-disable-next-line no-unused-vars
import SagaEffectIds from './helpers/SagaEffectIds';

import calculateRowStyles from './helpers/calculateRowStyles';
// eslint-disable-next-line no-unused-vars
import TimeDiff from '../TimeDiff.jsx';

export default function SagaEffectCanceled({ event, onClick, className }) {
  var label = 'canceled';
  const style = calculateRowStyles(event, { color: 'rgb(230, 230, 230)' });
  const { timeDiff } = event;

  return (
    <li style={ style } onClick={ onClick } className={ className }>
      <TimeDiff timeDiff={ timeDiff } parentStyle={ style } />
      <div className='actionRowContent'>
        <i className='fa fa-times-rectangle-o'></i>
        <SagaEffectIds event={ event } />
        { label }
      </div>
    </li>
  );
}
