import React from 'react';
import readFromPath from '../../../../helpers/readFromPath';
import PropTypes from 'prop-types';

const readFN = function (effectName, effect) {
  return readFromPath(effect, `${ effectName }.fn.__func`);
};
const readPattern = function (effectName, effect) {
  return readFromPath(effect, `${ effectName }.pattern`);
};
const readSelector = function (effectName, effect) {
  return readFromPath(effect, `${ effectName }.selector.__func`);
};
const readName = function (effectName, effect) {
  return readFromPath(effect, `${ effectName }.name`);
};

export default function SagaEffectName({ effect }) {
  if (typeof effect !== 'object') return null;

  if ('ALL' in effect) {
    return <span>all <strong>({ effect.ALL.length })</strong></span>;
  } else if ('FORK' in effect) {
    const fn = readFN('FORK', effect);

    return <span>fork { fn && <strong>{ fn }</strong> }</span>;
  } else if ('TAKE' in effect) {
    const pattern = readPattern('TAKE', effect);

    return <span>take { pattern && <strong>{ pattern }</strong> }</span>;
  } else if ('CALL' in effect) {
    const fn = readFN('CALL', effect);

    return <span>call { fn && <strong>{ fn }</strong> }</span>;
  } else if (Array.isArray(effect)) {
    return <span>({ effect.length })</span>;
  } else if ('SELECT' in effect) {
    const selector = readSelector('SELECT', effect);

    return <span>select { selector && <strong>{ selector }</strong> }</span>;
  } else if ('CANCEL' in effect) {
    const name = readName('CANCEL', effect);

    return <span>cancel <strong>#{ effect.CANCEL.id }</strong> { name && `(${ name })`}</span>;
  } else if ('PUT' in effect) {
    return <span>put <strong>{ effect.PUT.action.type }</strong></span>;
  } else if ('_invoke' in effect) {
    return <span>...</span>;
  }
  return null;
};

SagaEffectName.propTypes = {
  effect: PropTypes.any
};
