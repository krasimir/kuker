import PropTypes from 'prop-types';
import React from 'react';
import VueIcon from '../../icons/VueIcon';

import calculateRowStyles from './helpers/calculateRowStyles';
// eslint-disable-next-line no-unused-vars
import TimeDiff from '../../TimeDiff';

export default function VueEvent({ event, onClick, className }) {
  const style = calculateRowStyles(event, { color: 'rgb(230, 230, 230)' }, { padding: '0.2em 0.5em 0.5em 0.3em' });
  var label = event.type;

  switch (event.type) {
    case '@@vue_flush':
      label = 'Vue update';
      break;
    case '@@vue_ready':
      label = `Vue is READY / (version: ${ event.version })`;
      break;
  }

  return (
    <div style={ style } onClick={ onClick } className={ className }>
      <TimeDiff timeDiff={ event.timeDiff } parentStyle={ style } />
      <div className='actionRowContent'>
        <VueIcon style={{ float: 'left' }}></VueIcon>
        { label }
      </div>
    </div>
  );
};

VueEvent.propTypes = {
  event: PropTypes.object,
  onClick: PropTypes.func,
  className: PropTypes.string
};

VueEvent.isVueEvent = (({ type }) => type.split('_')[0] === '@@vue');
