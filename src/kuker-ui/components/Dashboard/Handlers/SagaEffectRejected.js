// eslint-disable-next-line no-unused-vars
import React from 'react';
import isDefined from '../../../helpers/isDefined';
import readFromPath from '../../../helpers/readFromPath';
// eslint-disable-next-line no-unused-vars
import SagaEffectName from './helpers/SagaEffectName';
// eslint-disable-next-line no-unused-vars
import SagaEffectIds from './helpers/SagaEffectIds';

import calculateRowStyles from './helpers/calculateRowStyles';
// eslint-disable-next-line no-unused-vars
import TimeDiff from '../../TimeDiff';

export default function SagaEffectCanceled({ event, onClick, className }) {
  var label = 'canceled';
  const { error, timeDiff } = event;
  const style = calculateRowStyles(event, { color: 'rgb(230, 230, 230)' });

  if (isDefined(error)) {
    const message = readFromPath(error, 'message', false);

    if (message) {
      label = <strong>{ message }</strong>;
    } else {
      label = 'error';
    }
  }

  return (
    <div style={ style } onClick={ onClick } className={ className }>
      <TimeDiff timeDiff={ timeDiff } parentStyle={ style } />
      <div className='actionRowContent'>
        <i className='fa fa-frown-o'></i>
        <SagaEffectIds event={ event } />
        { label }
      </div>
    </div>
  );
}
