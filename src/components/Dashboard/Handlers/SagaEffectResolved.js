// eslint-disable-next-line no-unused-vars
import React from 'react';
import isDefined from '../../../helpers/isDefined';
// eslint-disable-next-line no-unused-vars
import SagaEffectIds from './helpers/SagaEffectIds';
// eslint-disable-next-line no-unused-vars
import SagaEffectName from './helpers/SagaEffectName';
import renderJSONPreview from '../../../helpers/renderJSONPreview';

import calculateRowStyles from './helpers/calculateRowStyles';
// eslint-disable-next-line no-unused-vars
import TimeDiff from '../../TimeDiff';

const getResultRepresentation = function (result, i) {
  if (isDefined(result) && result !== null) {
    if (typeof result === 'object') {
      if ('@@redux-saga/TASK' in result) {
        return <strong key={ i }>{ result.name }&nbsp;</strong>;
      }
      return renderJSONPreview(result);
    }
    return result;
  }
  return null;
};

export default function SagaEffectResolved({ event, onClick, className }) {
  var label = '';
  const { result, timeDiff } = event;
  const style = calculateRowStyles(event, { color: 'rgb(230, 230, 230)' });

  if (isDefined(result)) {
    if (typeof result === 'object' && result !== null) {
      if ('@@redux-saga/TASK' in result) {
        label = getResultRepresentation(result);
      } else if ('type' in result) {
        label = result.type;
      } else if (Array.isArray(result)) {
        if (typeof result[0] === 'object' && result[0] !== null && '@@redux-saga/TASK' in result[0]) {
          label = result.map(getResultRepresentation);
        } else {
          label = renderJSONPreview(result);
        }
      } else {
        label = renderJSONPreview(result);
      }
    } else if (result !== null) {
      label = result;
    }
  }

  return (
    <li style={ style } onClick={ onClick } className={ className }>
      <TimeDiff timeDiff={ timeDiff } parentStyle={ style } />
      <div className='actionRowContent'>
        <i className='fa fa-check-square-o'></i>
        <SagaEffectIds event={ event } />
        { label }
      </div>
    </li>
  );
}
