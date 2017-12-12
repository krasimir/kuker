// eslint-disable-next-line no-unused-vars
import React from 'react';
import isDefined from '../../helpers/isDefined';
// eslint-disable-next-line no-unused-vars
import SagaEffectName from './helpers/SagaEffectName';
import renderJSONPreview from '../../helpers/renderJSONPreview';

import calculateRowStyles from './helpers/calculateRowStyles';
// eslint-disable-next-line no-unused-vars
import TimeDiff from '../TimeDiff.jsx';

export default function ReduxAction({ event, onClick, className }) {
  var label = '';
  const { action, timeDiff } = event;
  const style = calculateRowStyles(event, { color: 'rgb(200, 200, 200)' });

  if (isDefined(action)) {
    const { type, ...rest } = action;

    label = (
      <span>
        <strong>{ type }</strong> <small>{ renderJSONPreview(rest) }</small>
      </span>
    );
  }

  return (
    <li style={ style } onClick={ onClick } className={ className }>
      <TimeDiff timeDiff={ timeDiff } parentStyle={ style } />
      <div className='actionRowContent'>
        <i className='fa fa-dot-circle-o'></i>
        { label }
      </div>
    </li>
  );
}
