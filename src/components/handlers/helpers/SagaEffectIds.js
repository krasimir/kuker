// eslint-disable-next-line no-unused-vars
import React from 'react';
import readFromPath from '../../../helpers/readFromPath';
import isDefined from '../../../helpers/isDefined';

export default function SagaEffectIds({ event }) {
  const effectId = readFromPath(event, 'effectId', false);
  const parentEffectId = readFromPath(event, 'parentEffectId', false);

  return (
    <span style={{ marginRight: '0.3em' }}>
      { isDefined(effectId) && <strong>#{ effectId }
        { (isDefined(parentEffectId) && parentEffectId !== false) &&
          <span className='sagaParentEffect'>{ parentEffectId }</span>}
      </strong> }
    </span>
  );
};
