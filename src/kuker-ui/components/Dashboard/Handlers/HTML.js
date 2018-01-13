import PropTypes from 'prop-types';
import React from 'react';

import calculateRowStyles from './helpers/calculateRowStyles';
// eslint-disable-next-line no-unused-vars
import TimeDiff from '../../TimeDiff';

export default function HTMLEvent({ event, onClick, className }) {
  const style = calculateRowStyles(event, { color: 'rgb(230, 230, 230)' });
  var label = event.type;

  switch (event.type) {
    case '@@HTML_mutation':
      label = 'HTML mutation';
      break;
  }

  return (
    <div style={ style } onClick={ onClick } className={ className }>
      <TimeDiff timeDiff={ event.timeDiff } parentStyle={ style } />
      <div className='actionRowContent'>
        <i className='fa fa-code'></i> { label }
      </div>
    </div>
  );
};

HTMLEvent.propTypes = {
  event: PropTypes.object,
  onClick: PropTypes.func,
  className: PropTypes.string
};

HTMLEvent.isHTMLEvent = (({ type }) => type.split('_')[0] === '@@HTML');
