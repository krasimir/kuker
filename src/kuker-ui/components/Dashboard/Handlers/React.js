// eslint-disable-next-line no-unused-vars
import PropTypes from 'prop-types';
import React from 'react';
import ReactIcon from '../../icons/ReactIcon';

import calculateRowStyles from './helpers/calculateRowStyles';
// eslint-disable-next-line no-unused-vars
import TimeDiff from '../../TimeDiff';

const formatComponentAsTag = tagName => `<${ tagName }>`;

export default function ReactEvent({ event, onClick, className }) {
  const style = calculateRowStyles(event, { color: 'rgb(230, 230, 230)' });
  const { calls, components } = event;
  const shortComponentsNames = components && (components.length > 4 ?
    components.slice(0, 4).map(formatComponentAsTag).join(', ') + ' ...' :
    components.map(formatComponentAsTag).join(', '));
  var label = event.type;

  switch (event.type) {
    case '@@react_root_detected':
      label = 'Root node detected ';
      break;
    case '@@react_root':
      label = 'Root node ';
      break;
    case '@@react_mount':
      label = `Mount of ${ calls } component${ calls > 1 ? 's' : '' } `;
      break;
    case '@@react_update':
      label = 'Update ';
      break;
    case '@@react_unmount':
      label = `Unmount of ${ calls } component${ calls > 1 ? 's' : '' }`;
      break;
  }

  return (
    <div style={ style } onClick={ onClick } className={ className }>
      <TimeDiff timeDiff={ event.timeDiff } parentStyle={ style } />
      <div className='actionRowContent'>
        <ReactIcon style={{ float: 'left' }}></ReactIcon>
        { label }
        { shortComponentsNames && <strong><small>{ shortComponentsNames }</small></strong>}
      </div>
    </div>
  );
};

ReactEvent.propTypes = {
  event: PropTypes.object,
  onClick: PropTypes.func,
  className: PropTypes.string
};

ReactEvent.isReactEvent = (({ type }) => type.split('_')[0] === '@@react');
