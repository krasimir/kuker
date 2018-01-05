// eslint-disable-next-line no-unused-vars
import React from 'react';
import isDefined from '../../../helpers/isDefined';
// eslint-disable-next-line no-unused-vars
import SagaEffectName from './helpers/SagaEffectName';

import calculateRowStyles from './helpers/calculateRowStyles';
// eslint-disable-next-line no-unused-vars
import TimeDiff from '../../TimeDiff';

export default function SagaEffectActionDispatched({ event, onClick, className }) {
  var label = '';
  const { action, timeDiff } = event;
  const style = calculateRowStyles(event, { color: 'rgb(230, 230, 230)' });

  if (isDefined(action)) {
    label = <span>Action <strong>{ action.type }</strong> dispatched</span>;
  }

  return (
    <div style={ style } onClick={ onClick } className={ className }>
      <TimeDiff timeDiff={ timeDiff } parentStyle={ style } />
      <div className='actionRowContent'>
        <i className='fa fa-toggle-right'></i>
        { label }
      </div>
    </div>
  );
}
